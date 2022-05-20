import React from 'react';
import { CircularProgress } from '@mui/material';
import "../styles/loading.css";

export default function Loading() {

    return (
        <div className="loading-container">
            <CircularProgress />
        </div>
    )

}