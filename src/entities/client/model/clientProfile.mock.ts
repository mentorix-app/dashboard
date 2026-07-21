import { type ClientProfile, ExerciseCompletion, TrainingDayStatus, TrainingProgramStatus } from './training';

/**
 * UI-only sample data for the client profile screen. There is no backend for
 * training results yet, so the screen renders this static snapshot. Swap this
 * for a real query when the API lands — the component contracts already match.
 */
const MOCK_PROGRAMS: ClientProfile['programs'] = [
  {
    assignmentId: 'assign-active',
    programId: 'prog-badgers',
    programName: 'The Badgers Program',
    programNameRu: 'Программа «Барсуки»',
    status: TrainingProgramStatus.Active,
    assignedAt: '2026-07-06T09:00:00.000Z',
    weeks: [
      {
        weekNumber: 1,
        days: [
          {
            id: 'w1d1',
            dayNumber: 1,
            title: 'Upper Body',
            titleRu: 'Верх тела',
            status: TrainingDayStatus.New,
            receivedAt: '2026-07-12T21:34:00.000Z',
            clientFeedback: 'Сделал всё, чувствую себя хорошо 👍',
            coachNote: null,
            blocks: [
              { id: 'w1d1b1', title: 'Warm-up', titleRu: 'Разминка', completed: true },
              { id: 'w1d1b2', title: 'Strength Block', titleRu: 'Силовой блок', completed: true },
              { id: 'w1d1b3', title: 'Cooldown', titleRu: 'Заминка', completed: true },
            ],
            exercises: [
              {
                id: 'w1d1e1',
                name: 'Bench Press',
                nameRu: 'Жим лёжа',
                planned: '4 × 8',
                actual: '4 × 8',
                completion: ExerciseCompletion.CompletedAsPlanned,
              },
              {
                id: 'w1d1e2',
                name: 'Pull-ups',
                nameRu: 'Подтягивания',
                planned: '4 × 10',
                actual: '4 × 7 assisted',
                completion: ExerciseCompletion.Modified,
              },
            ],
          },
          {
            id: 'w1d2',
            dayNumber: 2,
            title: 'Cardio',
            titleRu: 'Кардио',
            status: TrainingDayStatus.NoResult,
            receivedAt: null,
            clientFeedback: null,
            coachNote: null,
            blocks: [{ id: 'w1d2b1', title: 'Intervals', titleRu: 'Интервалы', completed: false }],
            exercises: [
              {
                id: 'w1d2e1',
                name: 'Rowing',
                nameRu: 'Гребля',
                planned: '5 × 500m',
                actual: null,
                completion: ExerciseCompletion.Skipped,
              },
            ],
          },
          {
            id: 'w1d3',
            dayNumber: 3,
            title: 'Leg Day',
            titleRu: 'День ног',
            status: TrainingDayStatus.NeedsAttention,
            receivedAt: '2026-07-14T20:12:00.000Z',
            clientFeedback: 'Колено немного побаливало на приседе.',
            coachNote: 'Проверить технику приседа на следующей тренировке.',
            blocks: [
              { id: 'w1d3b1', title: 'Warm-up', titleRu: 'Разминка', completed: true },
              { id: 'w1d3b2', title: 'Squats', titleRu: 'Приседания', completed: true },
            ],
            exercises: [
              {
                id: 'w1d3e1',
                name: 'Back Squat',
                nameRu: 'Присед со штангой',
                planned: '5 × 5',
                actual: '5 × 5 @ reduced load',
                completion: ExerciseCompletion.Modified,
              },
            ],
          },
          {
            id: 'w1d4',
            dayNumber: 4,
            title: 'Rest Day',
            titleRu: 'День отдыха',
            status: TrainingDayStatus.NotRequired,
            receivedAt: null,
            clientFeedback: null,
            coachNote: null,
            blocks: [],
            exercises: [],
          },
          {
            id: 'w1d5',
            dayNumber: 5,
            title: 'Yoga',
            titleRu: 'Йога',
            status: TrainingDayStatus.Reviewed,
            receivedAt: '2026-07-16T19:45:00.000Z',
            clientFeedback: 'Хорошо потянулся, стало легче.',
            coachNote: 'Отличная работа, продолжай в том же духе.',
            blocks: [{ id: 'w1d5b1', title: 'Flow', titleRu: 'Поток', completed: true }],
            exercises: [
              {
                id: 'w1d5e1',
                name: 'Sun Salutation',
                nameRu: 'Приветствие солнцу',
                planned: '10 min',
                actual: '10 min',
                completion: ExerciseCompletion.CompletedAsPlanned,
              },
            ],
          },
        ],
      },
      {
        weekNumber: 2,
        days: [
          {
            id: 'w2d1',
            dayNumber: 1,
            title: 'Push',
            titleRu: 'Толчок',
            status: TrainingDayStatus.NoResult,
            receivedAt: null,
            clientFeedback: null,
            coachNote: null,
            blocks: [{ id: 'w2d1b1', title: 'Strength Block', titleRu: 'Силовой блок', completed: false }],
            exercises: [
              {
                id: 'w2d1e1',
                name: 'Overhead Press',
                nameRu: 'Жим над головой',
                planned: '4 × 6',
                actual: null,
                completion: ExerciseCompletion.Skipped,
              },
            ],
          },
          {
            id: 'w2d2',
            dayNumber: 2,
            title: 'Pull',
            titleRu: 'Тяга',
            status: TrainingDayStatus.NoResult,
            receivedAt: null,
            clientFeedback: null,
            coachNote: null,
            blocks: [{ id: 'w2d2b1', title: 'Strength Block', titleRu: 'Силовой блок', completed: false }],
            exercises: [
              {
                id: 'w2d2e1',
                name: 'Deadlift',
                nameRu: 'Становая тяга',
                planned: '3 × 5',
                actual: null,
                completion: ExerciseCompletion.Skipped,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    assignmentId: 'assign-completed',
    programId: 'prog-foundation',
    programName: 'Foundation Block',
    programNameRu: 'Базовый блок',
    status: TrainingProgramStatus.Completed,
    assignedAt: '2026-05-01T09:00:00.000Z',
    weeks: [
      {
        weekNumber: 1,
        days: [
          {
            id: 'f-w1d1',
            dayNumber: 1,
            title: 'Full Body',
            titleRu: 'Всё тело',
            status: TrainingDayStatus.Reviewed,
            receivedAt: '2026-05-03T18:20:00.000Z',
            clientFeedback: 'Первая тренировка прошла отлично!',
            coachNote: 'Хорошее начало.',
            blocks: [{ id: 'f-w1d1b1', title: 'Circuit', titleRu: 'Круговая', completed: true }],
            exercises: [
              {
                id: 'f-w1d1e1',
                name: 'Goblet Squat',
                nameRu: 'Гоблет-присед',
                planned: '3 × 12',
                actual: '3 × 12',
                completion: ExerciseCompletion.CompletedAsPlanned,
              },
            ],
          },
        ],
      },
    ],
  },
];

/**
 * Returns the mock client profile for a given client id. The id is echoed into
 * the header so navigation targets stay consistent while the data is static.
 */
export const getMockClientProfile = (clientUserId: string): ClientProfile => ({
  header: {
    clientUserId,
    displayName: 'Alexandra Khokhlova',
    username: 'khokhlova',
    avatarUrl: '',
    isActive: true,
    coachName: 'Daniel Smith',
    linkedAt: '2026-07-12T00:00:00.000Z',
    currentProgramName: 'The Badgers Program',
  },
  programs: MOCK_PROGRAMS,
});
