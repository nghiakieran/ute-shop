import { Outlet } from 'react-router-dom';
export const UserLayout = () => {
  return (
    <div className="user-theme user-layout">
      <Outlet />
    </div>
  );
};
