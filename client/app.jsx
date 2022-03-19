import { useState, useEffect } from 'react';
import { useApi } from './utils/use_api';
import { useJwtRefresh } from './utils/use_jwt_refresh';
import { parseJwt } from './utils/parse_jwt';
import './app.css';
import { Ping } from './components/home/ping';

export const App = () => {
  return <Ping />;
};
