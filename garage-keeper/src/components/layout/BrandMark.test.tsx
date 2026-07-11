import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { BrandMark } from './BrandMark';
import { APP_NAME } from '../../constants/brand';

describe('BrandMark', () => {
  it('renderiza el nombre de la app', () => {
    render(
      <MantineProvider>
        <BrandMark />
      </MantineProvider>,
    );
    expect(screen.getByText(APP_NAME)).toBeInTheDocument();
  });
});
