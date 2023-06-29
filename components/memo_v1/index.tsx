'use client';
import React from 'react';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, MemoData } from 'lib/indexeddb/db';

interface PageState {
    data: MemoData[]
    editData: {
        title: string,
        text: string
    }
}

interface PageFunctions {
    load: (id: number) => void
    deleteData: (id: number) => void
    save: () => void
    clear: () => void
    setEditData: (value: React.SetStateAction<{ title: string; text: string; }>) => void
}

const PageStateContext = React.createContext({} as PageState);
const PageFunctionsContext = React.createContext({} as PageFunctions);

const DataProvider: React.FC<{children?: React.ReactElement}> = ({children}) => {

    const data = useLiveQuery(() => {
        return db.memo.toArray()
    }) ?? [];

    const [editData, setEditData] = React.useState({
        title: '',
        text: ''
    });

    const save = () => {
        if (editData.text === '' || editData.title === '') {
            return;
        }
        const saveData: MemoData = {
            title: editData.title,
            text: editData.text
        };
        db.memo.add(saveData);
    }

    const load = (id: number) => {
        setEditData(() => {
            const loadData = data.find(x => (x.id ?? -1) === id) ?? {title: '', text: ''};
            return {
                ...loadData
            }
        })
    };

    const deleteData = (id: number) => {
        if (id < 0) {
            return;
        }
        db.memo.delete(id);
    }

    const pageState: PageState = {
        data,
        editData
    }

    const pageFunctions: PageFunctions = {
        load,
        deleteData,
        save,
        clear: () => {},
        setEditData,
    }

    return (
        <PageStateContext.Provider value={pageState}>
            <PageFunctionsContext.Provider value={pageFunctions}>
                {children}
            </PageFunctionsContext.Provider>
        </PageStateContext.Provider>
    )
}

const SelectPage: React.FC = () => {
    const { data } = React.useContext(PageStateContext);

    const { load, deleteData } = React.useContext(PageFunctionsContext);

    return (
        <React.Fragment>
            <div className='h-full'>
                <ul>
                    {data.map((x, i) => {
                        return (
                            <li className='border-b py-2 flex justify-between flex-nowrap relative' key={`memo-${x.id}`}>
                                <div className='truncate'>
                                    <a className='text-sm'>{`${x.title}`}</a>
                                </div>
                                <button
                                    onClick={() => load(x.id ?? 0)}
                                    className='absolute top-0 left-0 h-full w-full'
                                />
                                <div className='flex z-50'>
                                    <button onClick={() => deleteData(x.id ?? -1)} className=''>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
                                    </button>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </React.Fragment>
    )
}

const EditPage: React.FC = () => {
    const {setEditData, save} = React.useContext(PageFunctionsContext);

    const {editData} = React.useContext(PageStateContext);

    return (
        <React.Fragment>
            <section className='mx-2 my-2 flex flex-col overflow-y-scroll'>
                <div>
                    <a className='pr-2'>memotitle:</a>
                    <input value={editData.title} onChange={(e) => {setEditData((x) => ({...x, title: e.target.value}))}} className='border border-black px-1' type={'text'} id='memotitle' maxLength={20} size={20}/>
                </div>
                <div className='mt-2 px-1 h-[60] border border-black'>
                    <textarea value={editData.text} onChange={(e) => {setEditData((x) => ({...x, text: e.target.value}))}} rows={10} maxLength={1000} className='resize-none box-border w-full outline-none'>

                    </textarea>
                </div>
                <div className='mt-2 text-right'>
                    <button onClick={save} className='rounded border bg-gray-100 px-2 py-2'>
                        Save
                    </button>
                    <button onClick={() => setEditData(() => ({title: '', text: ''}))} className='rounded border bg-gray-100 ml-2 px-2 py-2'>
                        Clear
                    </button>
                </div>
            </section>
        </React.Fragment>
    )
}

const PageLayout: React.FC = () => {
    return (
        <React.Fragment>
            <section className='px-2 py-2 border-b sm:border-r sm:h-screen col-span-2'>
                <SelectPage />
            </section>
            <section className='sm:h-screen col-span-5 overflow-y-scroll'>
                <EditPage />
            </section>
        </React.Fragment>
    )
}

const Page: React.FC = () => {
    return (
        <DataProvider>
            <PageLayout />
        </DataProvider>
    )
}

export default Page;