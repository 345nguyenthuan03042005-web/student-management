import React from 'react';
import './Sidebar.css';
import { useLanguage } from '../hooks';

export const Sidebar = ({ activeMenu }) => {
  const { t } = useLanguage();

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        <div className={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`}>
          <a href="/dashboard">
            <span className="icon">DB</span>
            <span className="label">{t.common.dashboard}</span>
          </a>
        </div>

        <div className={`menu-item ${activeMenu === 'students' ? 'active' : ''}`}>
          <a href="/students">
            <span className="icon">SV</span>
            <span className="label">{t.common.students}</span>
          </a>
        </div>

        <div className={`menu-item ${activeMenu === 'classes' ? 'active' : ''}`}>
          <a href="/classes">
            <span className="icon">LH</span>
            <span className="label">{t.common.classes}</span>
          </a>
        </div>

        <div className={`menu-item ${activeMenu === 'subjects' ? 'active' : ''}`}>
          <a href="/subjects">
            <span className="icon">MH</span>
            <span className="label">{t.common.subjects}</span>
          </a>
        </div>

        <div className={`menu-item ${activeMenu === 'scores' ? 'active' : ''}`}>
          <a href="/scores">
            <span className="icon">DS</span>
            <span className="label">{t.common.scores}</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
