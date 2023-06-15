import React from 'react';

import MemoComponent from 'components/memo_v1';

const Page: React.FC = () => {
    return (
        <main className='h-full w-full grid grid-cols-1 sm:grid-cols-7'>
            <MemoComponent />
        </main>
    )
}


export default Page;