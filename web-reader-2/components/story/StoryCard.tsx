import React from 'react';
import { Story } from '@/types/interfaces/story';

interface StoryCardProps {
  story: Story;
  isSlide?: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, isSlide }) => {
  return (
    <div className={`story-card ${isSlide ? 'slide' : ''}`}>
      <h3 className="story-title">{story.title}</h3>
      <p className="story-description">{story.description}</p>
      <img src={story.imageUrl} alt={story.title} className="story-image" />
      <div className="story-meta">
        <span className="story-author">{story.author}</span>
        <span className="story-views">{story.views} views</span>
      </div>
    </div>
  );
};