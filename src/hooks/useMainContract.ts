import { useEffect, useState } from "react";
import { useTonClient } from "./useTonClient";
import { Address, OpenedContract, toNano } from "@ton/core";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { MainContract } from "../contracts/MainContract";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
    const client = useTonClient();
    const { sender } = useTonConnect();

    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

    const [contractData, setContractData] = useState<null | {
        counter_value: number,
        recent_sender: Address;
        owner_address: Address;
    }>();

    const [balance, setBalance] = useState<null | number>(0);

    const mainContract = useAsyncInitialize(async () => {
        if (!client) return;
        const contract = new MainContract(
            Address.parse("kQDo9gF2HuJGw--z6cdWxV5p-UUMQ0NHLvfMTuiXsmulKyZm")
        );
        return client.open(contract) as OpenedContract<MainContract>;
    }, [client]);

    useEffect(() => {
        async function getValue() {
            if (!mainContract) return;
            setContractData(null);
            const val = await mainContract.getData();
            const { balance } = await mainContract.getBalance();
            setContractData({
                counter_value: val.number,
                recent_sender: val.recent_sender,
                owner_address: val.owner_address,
            });
            setBalance(balance);
            await sleep(5000);
            getValue();
        }

        getValue();
    }, [mainContract]);

    return {
        contract_address: mainContract?.address.toString({ testOnly: true }),
        contract_balance: balance,
        ...contractData,
        sendIncrement: async () => {
            return mainContract?.sendIncrement(sender, toNano("0.05"), 3);
        },
        sendDeposit: async () => {
            return mainContract?.sendDeposit(sender, toNano("0.12"));
        },
        sendWithdrawRequest: async () => {
            return mainContract?.sendWithdrawRequest(sender, toNano("0.04"), toNano(0.1));
        },
    };
}