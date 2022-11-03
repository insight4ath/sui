// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Combobox } from '@headlessui/react';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import ModuleView from './ModuleView';

import { ReactComponent as SearchIcon } from '~/assets/SVGIcons/24px/Search.svg';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '~/ui/Tabs';
import { ListItem, VerticalList } from '~/ui/VerticalList';

interface Props {
    id?: string;
    modules: [moduleName: string, code: string][];
}

const initialSelectModule = (searchParams: any, modulenames: string[]) => {
    const paramModule = searchParams.get('module') || modulenames?.[0] || null;

    if (!!paramModule && modulenames.includes(paramModule)) {
        return paramModule;
    } else {
        return modulenames[0];
    }
};

function PkgModuleViewWrapper({ id, modules }: Props) {
    const modulenames = modules.map(([name], idx) => name);
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState('');
    const [selectedModule, setSelectedModule] = useState(
        initialSelectModule(searchParams, modulenames)
    );

    const filteredModules =
        query === ''
            ? modulenames
            : modules
                  .filter(([name]) => name.startsWith(query))
                  .map(([name]) => name);

    useEffect(() => {
        setSearchParams({ module: selectedModule });
    }, [selectedModule, setSearchParams]);

    const submitSearch = useCallback(() => {
        setSelectedModule((prev: string) =>
            filteredModules.includes(query) ? query : prev
        );
    }, [filteredModules, query]);

    return (
        <div
            className={
                'flex flex-wrap border-0 border-y border-solid border-sui-grey-45'
            }
        >
            <div className={'w-full lg:w-[15vw] pr-[20px]'}>
                <Combobox
                    value={selectedModule}
                    onChange={setSelectedModule}
                >
                    <div className="box-border border border-sui-grey-50 border-solid rounded-[6px] h-[34px] shadow-sm placeholder-sui-grey-65 pl-3 w-full flex my-[10px] justify-between  ml-[2px]">
                        <Combobox.Input
                            onChange={(event) => setQuery(event.target.value)}
                            displayValue={() => ''}
                            placeholder="Search"
                            className="border-none w-full"
                        />
                        <button
                            onClick={submitSearch}
                            className="bg-inherit border-none pr-3"
                        >
                            <SearchIcon className="fill-sui-steel cursor-pointer" />
                        </button>
                    </div>
                    <Combobox.Options
                        static
                        as="div"
                        className="w-full h-[209px] lg:h-[571px] overflow-auto mr-[-20px] pr-[20px]"
                    >
                        <VerticalList>
                            {filteredModules.map((name, idx) => (
                                <Combobox.Option key={name} value={name}>
                                    {({ active }) => (
                                        <div
                                            key={idx}
                                            className="min-w-full w-fit"
                                        >
                                            <ListItem
                                                active={
                                                    active ||
                                                    selectedModule === name
                                                }
                                            >
                                                {name}
                                            </ListItem>
                                        </div>
                                    )}
                                </Combobox.Option>
                            ))}
                        </VerticalList>
                    </Combobox.Options>
                </Combobox>
            </div>
            <div className="border-0 lg:border-l border-solid border-sui-grey-45 lg:pl-[30px] pt-[20px]">
                <TabGroup size="md">
                    <TabList>
                        <Tab>Bytecode</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <div className="overflow-auto h-[555px] w-[87vw] lg:w-[75vw]">
                                {modules
                                    .filter(([name]) => name === selectedModule)
                                    .map(([name, code], idx) => (
                                        <ModuleView
                                            key={idx}
                                            id={id}
                                            name={name}
                                            code={code}
                                        />
                                    ))}
                            </div>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>
        </div>
    );
}
export default PkgModuleViewWrapper;
