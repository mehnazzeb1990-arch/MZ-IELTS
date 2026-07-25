import React from 'react';
import { CourseOverviewPage } from './CourseOverviewPage';
import { IELTSSet } from '../types';

interface HomePageProps {
  onStartTest: (selectedSet: IELTSSet) => void;
  onNavigatePage?: (pageId: 'test' | 'study_bank' | 'criteria_guide' | 'features_lab') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartTest, onNavigatePage }) => {
  return (
    <CourseOverviewPage
      onStartTest={onStartTest}
      onNavigatePage={(pageId) => {
        if (onNavigatePage) {
          onNavigatePage(pageId);
        }
      }}
    />
  );
};
