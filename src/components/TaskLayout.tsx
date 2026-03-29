import { Outlet } from 'react-router-dom';
import { AppBar } from './AppBar';

export function TaskLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppBar showBack />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
