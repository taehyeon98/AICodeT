import { initialLearningState, LearningAction, learningReducer, LearningState } from '../learning/state';
import { decodeProgress, encodeProgress, progressKey, StorageAdapter } from './storage';

export type ProgressSnapshot = {
  state: LearningState;
  phase: 'loading' | 'ready' | 'load-error' | 'resetting';
  saveStatus: 'saved' | 'saving' | 'error';
  notice: string;
};

// A single queue orders writes and deletion, including after a failed write.
export function createProgressStore(storage: StorageAdapter) {
  let snapshot: ProgressSnapshot = { state: initialLearningState(), phase: 'loading', saveStatus: 'saved', notice: '' };
  const listeners = new Set<() => void>();
  let queue: Promise<void> = Promise.resolve();
  let loading: Promise<void> | null = null;
  let revision = 0;
  const publish = (next: Partial<ProgressSnapshot>) => {
    snapshot = { ...snapshot, ...next };
    listeners.forEach(listener => listener());
  };
  const enqueue = (operation: () => Promise<void>) => {
    const task = queue.then(operation);
    queue = task.catch(() => undefined);
    return task;
  };
  function save() {
    const currentRevision = ++revision;
    const encoded = encodeProgress(snapshot.state);
    publish({ saveStatus: 'saving', notice: '' });
    return enqueue(() => storage.setItem(progressKey, encoded)).then(() => {
      if (revision === currentRevision) publish({ saveStatus: 'saved' });
    }, () => {
      if (revision === currentRevision) publish({ saveStatus: 'error', notice: '저장하지 못했어요. 기기 여유 공간을 확인하고 다시 시도해주세요. 지금 종료하면 최근 풀이가 사라질 수 있어요.' });
    });
  }
  function load(): Promise<void> {
    if (loading) return loading;
    if (snapshot.phase === 'ready' || snapshot.phase === 'resetting') return Promise.resolve();
    publish({ phase: 'loading', notice: '' });
    loading = (async () => {
      let raw: string | null;
      try { raw = await storage.getItem(progressKey); }
      catch { publish({ phase: 'load-error', notice: '기록을 읽지 못했어요. 기존 기록을 덮어쓰지 않았어요. 다시 불러오거나 초기화를 선택해주세요.' }); return; }
      try { publish({ state: decodeProgress(raw), phase: 'ready', saveStatus: 'saved' }); }
      catch { publish({ phase: 'load-error', notice: '기록이 손상됐거나 학습 버전과 맞지 않아요. 기존 기록을 유지했어요. 다시 불러오거나 초기화를 선택해주세요.' }); }
    })().finally(() => { loading = null; });
    return loading;
  }
  return {
    getSnapshot: () => snapshot,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    load,
    dispatch: (action: LearningAction) => {
      if (snapshot.phase !== 'ready') return;
      const state = learningReducer(snapshot.state, action);
      if (state === snapshot.state) return;
      publish({ state });
      void save();
    },
    retrySave: () => snapshot.phase === 'ready' ? save() : Promise.resolve(),
    reset: async () => {
      if (snapshot.phase === 'loading' || snapshot.phase === 'resetting') return;
      const previousPhase = snapshot.phase;
      ++revision;
      publish({ phase: 'resetting', notice: '' });
      try {
        await enqueue(() => storage.removeItem(progressKey));
        publish({ state: initialLearningState(), phase: 'ready', saveStatus: 'saved', notice: '이 기기의 학습 기록을 초기화했어요.' });
      } catch {
        publish({ phase: previousPhase, saveStatus: 'error', notice: '초기화하지 못했어요. 현재 풀이를 유지했어요. 잠시 후 초기화를 다시 시도해주세요.' });
      }
    },
    whenIdle: () => queue,
  };
}
