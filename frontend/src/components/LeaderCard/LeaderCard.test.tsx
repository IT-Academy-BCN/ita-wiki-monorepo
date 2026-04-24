import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import LeaderCard from './LeaderCard';
import type { Player } from '../../types/league';

const mockPlayer: Player = {
  position: 1,
  username: 'Developer_134',
  avatarUrl: 'https://example.com/avatar.jpg',
  title: 'Expert Hacker',
  points: 94,
};

describe('LeaderCard', () => {
  it('renders username and points', () => {
    render(<LeaderCard player={mockPlayer} cupType="gold" />);

    expect(screen.getByText('Developer_134')).toBeInTheDocument();
    expect(screen.getByText('94')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<LeaderCard player={mockPlayer} cupType="gold" />);

    expect(screen.getByText('Expert Hacker')).toBeInTheDocument();
  });

  it('renders gold cup icon', () => {
    render(<LeaderCard player={mockPlayer} cupType="gold" />);

    expect(screen.getByLabelText('gold cup')).toBeInTheDocument();
  });

  it('renders silver cup icon', () => {
    render(<LeaderCard player={{ ...mockPlayer, position: 2 }} cupType="silver" />);

    expect(screen.getByLabelText('silver cup')).toBeInTheDocument();
  });

  it('renders bronze cup icon', () => {
    render(<LeaderCard player={{ ...mockPlayer, position: 3 }} cupType="bronze" />);

    expect(screen.getByLabelText('bronze cup')).toBeInTheDocument();
  });

  it('renders avatar image when avatarUrl is valid', () => {
    render(<LeaderCard player={mockPlayer} cupType="gold" />);

    expect(screen.getByAltText('Developer_134 avatar')).toBeInTheDocument();
  });

  it('shows initials when avatar fails to load', () => {
    render(<LeaderCard player={mockPlayer} cupType="gold" />);

    const img = screen.getByAltText('Developer_134 avatar');
    fireEvent.error(img);

    expect(screen.getByText('DE')).toBeInTheDocument();
  });

  it('shows initials when avatarUrl is empty', () => {
    render(<LeaderCard player={{ ...mockPlayer, avatarUrl: '' }} cupType="gold" />);

    expect(screen.getByText('DE')).toBeInTheDocument();
  });
});
