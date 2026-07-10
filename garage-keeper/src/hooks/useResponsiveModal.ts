import type { ModalProps } from '@mantine/core';
import { useIsMobile } from './useIsMobile';

export function useResponsiveModalProps(
  overrides?: Partial<ModalProps>,
): Partial<ModalProps> {
  const isMobile = useIsMobile();
  return {
    centered: !isMobile,
    fullScreen: isMobile,
    ...overrides,
  };
}
