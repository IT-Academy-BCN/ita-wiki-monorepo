import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LeagueToggle from './LeagueToggle';

describe('LeagueToggle', () => {
  it('renders both options', () => {
    render(<LeagueToggle view="weekly" onChange={vi.fn()} />);
    expect(screen.getByText('Lliga setmanal')).toBeInTheDocument();
    expect(screen.getByText('Classificació general')).toBeInTheDocument();
  });

  it('marks the active option with aria-pressed', () => {
    render(<LeagueToggle view="global" onChange={vi.fn()} />);
    expect(screen.getByText('Classificació general')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Lliga setmanal')).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange with the correct value', () => {
    const onChange = vi.fn();
    render(<LeagueToggle view="global" onChange={onChange} />);
    fireEvent.click(screen.getByText('Lliga setmanal'));
    expect(onChange).toHaveBeenCalledWith('weekly');
  });
});
