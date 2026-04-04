"use client";
import React from "react";
import { ConfigProvider, message } from "antd";

const AntdMessageContext = React.createContext<any>(null);

export const AntdMessageProvider = ({ children }: { children: React.ReactNode }) => {
    const [messageApi, contextHolder] = message.useMessage();
    // Set Ant Design message global top offset (e.g., 96px below navbar)
    React.useEffect(() => {
        message.config({ top: 96 }); // px, adjust as needed for your navbar
    }, []);
    return (
        <ConfigProvider warning={{ strict: false }}>
            <AntdMessageContext.Provider value={messageApi}>
                {contextHolder}
                {children}
            </AntdMessageContext.Provider>
        </ConfigProvider>
    );
};

export const useAntdMessage = () => React.useContext(AntdMessageContext);
