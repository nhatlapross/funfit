import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MyHackathon from './MyHackathon';
import AllHackathon from './AllHackathon';

const FitnessHackathonSlider = () => {
    const [activeTab, setActiveTab] = useState('market');
    return (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 bg-gray-600">
                    <TabsTrigger
                        value="market"
                        className={`px-4 py-2 text-center ${activeTab === 'market'
                            ? 'bg-blue-500 text-white' // Active tab styles
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white' // Inactive tab styles
                            }`}
                    >
                        All Hackathon 
                    </TabsTrigger>
                    <TabsTrigger
                        value="my-nfts"
                        className={`px-4 py-2 text-center ${activeTab === 'my-nfts'
                            ? 'bg-blue-500 text-white' // Active tab styles
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white' // Inactive tab styles
                            }`}
                    >
                        My Hackathon
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="market">
                    <AllHackathon />
                </TabsContent>
                <TabsContent value="my-nfts">
                    <MyHackathon />
                </TabsContent>
            </Tabs>

    );
};

export default FitnessHackathonSlider;