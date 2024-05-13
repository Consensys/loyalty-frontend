import React, { useEffect, useState } from "react";
import styles from "../Styles/RewardsPoints.module.scss";
import axios from "axios";
import { useAccount } from "wagmi";
import { useAccountStore } from "../store";
import { CircularProgress } from "@mui/material";
import { FETCH_CONFIG } from '../constants';

const START_REWARDS_POINTS_URL = 'https://hooks.zapier.com/hooks/catch/9914807/3jse00x'
const POLL_REWARDS_POINTS_URL = 'https://api.airtable.com/v0/app8TcmDxsrrZZJtw/Buld%20For%20MetaMask'
const CLAIM_REWARDS_POINTS_URL = (address) => `https://f3ae-109-255-0-100.ngrok-free.app/v1/points/rps/${address}/claim`

const RewardsPoints = () => {
  const { address } = useAccount()
  const [isClaiming, setIsClaiming] = useState(false)
  const contractAddress = useAccountStore(state => state.contractAddress)
  const [pointsData, setPointsData] = useState({
    "Available Balance": 0,
    "Total Amount": 0,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const pollRewardsPoints = async () => {
    const {
      data: { records },
    } = await axios.get(POLL_REWARDS_POINTS_URL, {
      headers: {
        Accept: "*/*",
        Authorization:
          "Bearer patBpvtowxhAUhXeA.ac023312f7f85803cc45d42d509c503ca73beba997d75dda3b39cf04073cc332",
      },
    });
    const item = records.find(
      (item) => item.fields.SmartContractAddress === contractAddress,
    );
    if (item) {
      return item.fields;
    }
  };

  const fetchRewardsPoints = async () => {
    if (!address || !contractAddress) return;
    try {
      setIsProcessing(true);
      const {
        data: { status },
      } = await axios.get(START_REWARDS_POINTS_URL, {
        params: {
          address: contractAddress,
        },
      });
      if (status !== "success") {
        throw new Error("Failed to start fetching rewards points");
      }

      let interval;
      return new Promise((resolve, reject) => {
        interval = setInterval(async () => {
          try {
            const data = await pollRewardsPoints(resolve, reject, interval);
            if (data) {
              setPointsData(data);
              resolve();
            }
          } catch (err) {
            console.error(err);
            reject();
          } finally {
            clearInterval(interval);
            setIsProcessing(false);
          }
        }, 2000);
      });
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const claimAvailablePoints = async () => {
    setIsClaiming(true)
    try {
      await axios.post(CLAIM_REWARDS_POINTS_URL(address), {
        rps: pointsData['Available Balance']
      }, FETCH_CONFIG)
      fetchRewardsPoints()
    } catch (err) {
      console.error(err)
    } finally {
      setIsClaiming(false)
    }
  }

  useEffect(() => {
    fetchRewardsPoints();
  }, [address, contractAddress]);

  return (
    <div className={`${styles.rewardsPoints} Stamp`}>
      <div className={styles.availableArea}>
        <div className={`header ${styles.availableHeader}`}>
          <div className={"text"}>
            <img src="/images/trophy.svg" alt="Trophy" />
            Available Reward Points
          </div>
          <div onClick={claimAvailablePoints} className={styles.cta}>
            {isClaiming ? (
              <CircularProgress color="inherit" size="xs" />
            ) : (
              <span>Claim</span>
            )}
          </div>
        </div>
        <div className={`stat ${styles.stat}`}>
          {isProcessing ? (
            <CircularProgress />
          ) : (
            <>
              <span className={"value"}>
                {pointsData?.["Available Balance"]}
              </span>
              <span className={"unit"}>RPS</span>
            </>
          )}
        </div>
      </div>
      <div className={styles.balanceArea}>
        <div className={`header ${styles.balanceHeader}`}>
          <img src="/images/trophy.svg" alt="Trophy" />
          Rewards Point Balance
        </div>
        <div className={`stat ${styles.stat}`}>
          {isProcessing ? (
            <CircularProgress />
          ) : (
            <>
              <span className={"value"}>{pointsData?.["Total Amount"]}</span>
              <span className={"unit"}>RPS</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardsPoints;
