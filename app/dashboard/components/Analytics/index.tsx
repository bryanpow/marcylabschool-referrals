"use client";
import useSWR, { mutate } from "swr";
import ReferralService from "@/app/services/ReferralService";
import UserService from "@/app/services/UserService";
import React, { useEffect, useState } from "react";
import YearChart from "../Charts/YearChart";
import WeeklyChart from "../Charts/WeeklyChart";
import Loader from "@/app/components/layout/Loader";
import { useStore } from "@/app/state/useStore";
import ReferralTable from "../Tables/ReferralTable/ReferralTable";
import AuthRequests from "./components/AuthRequests";
import AdminControls from "./components/AdminControls";
import UserStats from "./components/UserStats";
import { calculateWeeklyPercentIncrease, generateSWRKey } from "./utils";
import { supabase } from "@/app/utils/supabaseClient";

const Analytics: React.FC = () => {
  const { user, initialPageLoad, setInitialPageLoad } = useStore();
  const [refresh, setRefresh] = useState(false);
  const [percentIncrease, setPercentIncrease] = useState({
    referrals: 0,
    points: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(
    null
  );
  const [selectedUserStats, setSelectedUserStats] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [view, setView] = useState("all");

  // SWR for data fetching and caching, only when `user.email` is defined
  const { data: userStats, error } = useSWR(
    // Generate a unique key for the SWR cache
    generateSWRKey(user?.email || "", selectedUserEmail),
    () =>
      ReferralService.getReferralStats(selectedUserEmail || user?.email || ""),
    {
      refreshInterval: 0,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: false,
    }
  );

  useEffect(() => {
    if (user?.email) {
      const channel = supabase
        .channel("referrals_channel") // Create a channel
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "Referral" },
          (payload) => {
            console.log("Change received in referrals table!", payload);
            // Trigger data refresh
            mutate(`referral-stats-${user?.email || ""}`);
          }
        )
        .subscribe();

      // Cleanup on component unmount
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  // Keep track of of weather or not the page has hard refreshed
  useEffect(() => {
    if (initialPageLoad) {
      setIsLoaded(false);
      setTimeout(() => setIsLoaded(true), 2500);
      setInitialPageLoad(false);
    }
  });

  // On refresh, refresh the data
  useEffect(() => {
    if (user?.email) {
      mutate(`referral-stats-${user.email}`);
      setSearchQuery("");

      setSelectedUserEmail(null);
      setSelectedUserStats(null);
    }
  }, [refresh, user?.email]);

  // Calculate the weekly percent increase
  useEffect(() => {
    const percentIncrease = calculateWeeklyPercentIncrease(
      selectedUserStats ? selectedUserStats : userStats
    );
    setPercentIncrease(percentIncrease);
  }, [userStats]);

  // Handle the search input change
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    try {
      const users = await UserService.search(query);
      console.log("search resuls", users);
      setFilteredUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle the user select from autocomplete menu
  const handleUserSelect = async (email: string, name: string) => {
    setView("single");
    setSearchQuery(email);
    setSelectedUserEmail(email);
    setFilteredUsers([]);
    setStatsLoaded(false);
    const userStats = await ReferralService.getReferralStats(email, false);
    setSelectedUserStats(userStats);
  };

  return (
    <>
      <div
        className={` w-[90%]  ${initialPageLoad || error ? "invisible" : ""} ${
          user?.role === "USER" && "pt-[2rem]"
        }  m-auto flex-col `}
      >
        {user?.role === "ADMIN" && (
          <AdminControls
            setSelectedUserStats={setSelectedUserStats}
            searchQuery={searchQuery}
            filteredUsers={filteredUsers}
            handleUserSelect={handleUserSelect}
            handleSearchChange={handleSearchChange}
            setRefresh={setRefresh}
            setSelectedUserEmail={setSelectedUserEmail}
            setStatsLoaded={setStatsLoaded}
            setView={setView}
            view={view}
          />
        )}

        {!isLoaded || !(userStats || selectedUserStats) ? (
          <Loader />
        ) : (
          (selectedUserStats || userStats) && (
            <>
              <div
                // If the user is an admin, display the stats in a 3 column grid, otherwise display in a 2 column grid
                // This is because the admin has an extra component to display
                className={` grid ${
                  user?.role === "ADMIN" && view === "all"
                    ? "xl:grid-cols-3 md:grid-cols-1 "
                    : " xl:grid-cols-2 md:grid-cols-2"
                } grid-cols-1 m-auto gap-4  md:gap-6  2xl:gap-7.5`}
              >
                <UserStats
                  setLoaded={setStatsLoaded}
                  userStats={selectedUserStats || userStats}
                  percentIncrease={percentIncrease}
                  loaded={statsLoaded}
                  selectedUserStats={selectedUserStats}
                />
                {user?.role === "ADMIN" && view === "all" && (
                  <AuthRequests
                    setLoaded={setStatsLoaded}
                    loaded={statsLoaded}
                  />
                )}
              </div>

              <div className="mt-4 grid mb-4 grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                <ReferralTable
                  email={selectedUserEmail}
                  refresh={() => setRefresh(!refresh)}
                />
                <WeeklyChart
                  loaded={statsLoaded}
                  setLoaded={setStatsLoaded}
                  userStats={selectedUserStats || userStats}
                />
              </div>
              <YearChart
                setLoaded={setStatsLoaded}
                loaded={statsLoaded}
                userStats={selectedUserStats || userStats}
              />
            </>
          )
        )}
      </div>
    </>
  );
};

export default Analytics;
