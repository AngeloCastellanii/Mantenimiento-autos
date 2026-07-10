import { Component, type ReactNode } from 'react';
import { Button, Center, Stack, Text, Title } from '@mantine/core';
import { IconMoodSad } from '@tabler/icons-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('ErrorBoundary capturó un error:', error);
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        <Center mih={320}>
          <Stack align="center" gap="sm">
            <IconMoodSad size={48} color="var(--mantine-color-red-6)" />
            <Title order={4}>Algo salió mal en esta sección</Title>
            <Text c="dimmed" size="sm" ta="center" maw={360}>
              Puedes volver al inicio o reintentar. El resto de la app sigue
              funcionando.
            </Text>
            <Button onClick={this.reset}>Reintentar</Button>
          </Stack>
        </Center>
      );
    }
    return this.props.children;
  }
}
