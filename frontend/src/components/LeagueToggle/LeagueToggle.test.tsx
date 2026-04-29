import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import LeagueToggle from './LeagueToggle';

describe('LeagueToggle', () => {
  it('renders both toggle options', () => {
    render(<LeagueToggle view="weekly" onChange={vi.fn()} />);

    expect(screen.getByText('Liga semanal')).toBeInTheDocument();
    expect(screen.getByText('Ranking general')).toBeInTheDocument();
  });

  it('marks weekly button as active when view is weekly', () => {
    render(<LeagueToggle view="weekly" onChange={vi.fn()} />);

    expect(screen.getByText('Liga semanal')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Ranking general')).toHaveAttribute('aria-pressed', 'false');
  });

  it('marks global button as active when view is global', () => {
    render(<LeagueToggle view="global" onChange={vi.fn()} />);

    expect(screen.getByText('Ranking general')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Liga semanal')).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange with weekly when Liga semanal is clicked', () => {
    const onChange = vi.fn();
    render(<LeagueToggle view="global" onChange={onChange} />);

    fireEvent.click(screen.getByText('Liga semanal'));

    expect(onChange).toHaveBeenCalledWith('weekly');
  });

  it('calls onChange with global when Ranking general is clicked', () => {
    const onChange = vi.fn();
    render(<LeagueToggle view="weekly" onChange={onChange} />);

    fireEvent.click(screen.getByText('Ranking general'));

    expect(onChange).toHaveBeenCalledWith('global');
  });
});
