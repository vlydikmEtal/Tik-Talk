import { createSelector } from '@ngrx/store';
import { profileFeature } from './reducer';
import { Profile } from '@tt/interfaces/profile';

export const selectFilteredProfiles = createSelector(
  profileFeature.selectProfiles,
  (profiles: Profile[]) => profiles
)
