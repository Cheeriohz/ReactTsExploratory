import React, { Component } from 'react';
import { Route, Routes } from 'react-router';
import { Home } from './components/Home';
import { Layout } from './components/Layout';
import logo from './logo.svg';
import './App.css';
import { FetchData } from './components/FetchData';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/fetch-data' element={<FetchData />} />
            </Routes>
        </Layout>
  );
}

export default App;
