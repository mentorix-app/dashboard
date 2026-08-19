export const getBlockVisibilityErrorMessageKey = (errorCode: string) => {
  switch (errorCode) {
    case 'clientRequired':
      return 'structure.blocks.visibility.errors.clientRequired';
    case 'assignmentsUnavailable':
      return 'structure.blocks.visibility.errors.assignmentsUnavailable';
    case 'clientNotAssigned':
      return 'structure.blocks.visibility.errors.clientNotAssigned';
    case 'noSharedBlock':
      return 'structure.blocks.visibility.errors.noSharedBlock';
    case 'clientListRequired':
      return 'structure.blocks.visibility.errors.clientListRequired';
    case 'visibilityMismatch':
      return 'structure.blocks.visibility.errors.visibilityMismatch';
    case 'forbidden':
      return 'structure.blocks.visibility.errors.forbidden';
    case 'notFound':
      return 'structure.blocks.visibility.errors.notFound';
    default:
      return 'structure.blocks.visibility.errors.unknown';
  }
};
