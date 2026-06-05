'use client';
import { useEffect } from 'react';

export default function AboutRedirect() {
  useEffect(() => {
    window.location.replace('/en/about');
  }, []);
  return null;
}
