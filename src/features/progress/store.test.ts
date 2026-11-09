import { initialLearningState } from '../learning/state';
import { createProgressStore } from './store';
import { decodeProgress, encodeProgress, progressKey, StorageAdapter } from './storage';

function memory(initial: string | null = null) {
  const values = new Map<string, string>([['unrelated', 'keep']]);
  if (initial !== null) values.set(progressKey, initial);
  const adapter: StorageAdapter = {
    getItem: jest.fn(async key => values.get(key) ?? null),
    setItem: jest.fn(async (key, value) => { values.set(key, value); }),
    removeItem: jest.fn(async key => { values.delete(key); }),
  };
  return { values, adapter };
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(r => { resolve = r; });
  return { promise, resolve };
}
test('불러오기 전 입력·초기 저장을 막고 기존 풀이를 복원한다', async () => {
  const { adapter } = memory();
  const pending = deferred<string | null>();
  adapter.getItem = jest.fn(() => pending.promise);
  const store = createProgressStore(adapter);
  const load = store.load();
  store.dispatch({ type: 'next' });
  expect(adapter.setItem).not.toHaveBeenCalled();
  expect(store.getSnapshot().state.step).toBe(0);
  pending.resolve(encodeProgress({ ...initialLearningState(), step: 1 }));
  await load;
  expect(store.getSnapshot().state.step).toBe(1);
  expect(store.getSnapshot().phase).toBe('ready');
});
test('빠른 연속 변경은 순서대로 저장하며 새 실행에서 마지막 답을 복원한다', async () => {
  const { adapter, values } = memory();
  const first = deferred<void>();
  const original = adapter.setItem;
  adapter.setItem = jest.fn().mockImplementationOnce(async (key, value) => {
    await first.promise;
    await original(key, value);
  }).mockImplementation(original);
  const store = createProgressStore(adapter);
  await store.load();
  store.dispatch({ type: 'next' });
  store.dispatch({ type: 'select', value: 0 });
  store.dispatch({ type: 'select', value: 1 });
  await Promise.resolve();
  expect(adapter.setItem).toHaveBeenCalledTimes(1);
  expect(store.getSnapshot().saveStatus).toBe('saving');
  first.resolve();
  await store.whenIdle();
  expect(decodeProgress(values.get(progressKey)!).answers[0]).toBe(1);
  expect(store.getSnapshot().saveStatus).toBe('saved');
  const reopened = createProgressStore(adapter);
  await reopened.load();
  expect(reopened.getSnapshot().state).toEqual(store.getSnapshot().state);
});
test('용량 부족 등 저장 실패를 표시하고 같은 최신 풀이로 재시도한다', async () => {
  const { adapter, values } = memory();
  const original = adapter.setItem;
  adapter.setItem = jest.fn().mockRejectedValueOnce(new Error('disk full')).mockImplementation(original);
  const store = createProgressStore(adapter);
  await store.load();
  store.dispatch({ type: 'next' });
  await store.whenIdle();
  expect(store.getSnapshot().saveStatus).toBe('error');
  expect(values.has(progressKey)).toBe(false);
  await store.retrySave();
  expect(store.getSnapshot().saveStatus).toBe('saved');
  expect(decodeProgress(values.get(progressKey)!).step).toBe(1);
});
test('읽기 실패 후 기존 기록을 덮어쓰지 않고 재시도할 수 있다', async () => {
  const { adapter } = memory(encodeProgress({ ...initialLearningState(), step: 1 }));
  const original = adapter.getItem;
  adapter.getItem = jest.fn().mockRejectedValueOnce(new Error('unavailable')).mockImplementation(original);
  const store = createProgressStore(adapter);
  await store.load();
  store.dispatch({ type: 'next' });
  expect(store.getSnapshot().phase).toBe('load-error');
  expect(adapter.setItem).not.toHaveBeenCalled();
  await store.load();
  expect(store.getSnapshot().state.step).toBe(1);
});
test('먼저 요청한 저장의 실패가 뒤에 성공한 최신 저장을 오류로 바꾸지 않는다', async () => {
  const { adapter, values } = memory();
  const original = adapter.setItem;
  adapter.setItem = jest.fn().mockRejectedValueOnce(new Error('transient')).mockImplementation(original);
  const store = createProgressStore(adapter);
  await store.load();
  store.dispatch({ type: 'next' });
  store.dispatch({ type: 'select', value: 1 });
  await store.whenIdle();
  expect(store.getSnapshot().saveStatus).toBe('saved');
  expect(decodeProgress(values.get(progressKey)!).answers[0]).toBe(1);
});
test('손상 기록은 보존하며 명시적 초기화 후에만 새 학습을 시작한다', async () => {
  const { adapter, values } = memory('broken');
  const store = createProgressStore(adapter);
  await store.load();
  expect(store.getSnapshot().phase).toBe('load-error');
  expect(values.get(progressKey)).toBe('broken');
  await store.reset();
  expect(store.getSnapshot().phase).toBe('ready');
  expect(values.has(progressKey)).toBe(false);
  expect(values.get('unrelated')).toBe('keep');
});
test('초기화는 대기 중 저장 뒤에 수행하여 오래된 기록이 부활하지 않는다', async () => {
  const { adapter, values } = memory();
  const pending = deferred<void>();
  const original = adapter.setItem;
  adapter.setItem = jest.fn(async (key, value) => { await pending.promise; await original(key, value); });
  const store = createProgressStore(adapter);
  await store.load();
  store.dispatch({ type: 'next' });
  const reset = store.reset();
  store.dispatch({ type: 'next' });
  expect(store.getSnapshot().phase).toBe('resetting');
  pending.resolve();
  await reset;
  expect(store.getSnapshot().state).toEqual(initialLearningState());
  expect(values.has(progressKey)).toBe(false);
  expect(values.get('unrelated')).toBe('keep');
});
test('초기화 실패 시 현재 풀이와 저장 기록을 유지한다', async () => {
  const { adapter, values } = memory(encodeProgress({ ...initialLearningState(), step: 1 }));
  adapter.removeItem = jest.fn().mockRejectedValue(new Error('unavailable'));
  const store = createProgressStore(adapter);
  await store.load();
  await store.reset();
  expect(store.getSnapshot().state.step).toBe(1);
  expect(store.getSnapshot().saveStatus).toBe('error');
  expect(decodeProgress(values.get(progressKey)!).step).toBe(1);
});
