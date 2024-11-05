import React from 'react';
import Image from 'next/image';
import under_construction from '@/app/assets/under_construction.svg';

const Dashboard: React.FC = () => {
    return (
        <div className='flex flex-col'>
            <h1>Dashboard</h1>
            <hr />
            <Image loading='lazy' quality={80} width={200} height={200} alt="Under Construction" src={under_construction} className='place-self-center' />
            <p className='text-center'>This part of the app is currently under construction. Please check back later.</p>
        </div>
    );
};

export default Dashboard;