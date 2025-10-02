"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PlusCircleIcon,
  CalendarIcon,
  UsersIcon,
  SettingsIcon,
  BuildingIcon,
} from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <BuildingIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Settings</CardTitle>
            <SettingsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              System running normally
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/event/new">
              <Button
                className={`w-full justify-start transition-all duration-200 ${
                  hoveredButton === "manage"
                    ? "bg-background text-foreground border border-input"
                    : ""
                }`}
                variant={hoveredButton === "manage" ? "outline" : "default"}
                onMouseEnter={() => setHoveredButton("create")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                Create New Event
              </Button>
            </Link>
            <Link href="/admin/event">
              <Button
                variant={hoveredButton === "manage" ? "default" : "outline"}
                className={`w-full justify-start transition-all duration-200 ${
                  hoveredButton === "create"
                    ? "bg-background text-foreground border border-input"
                    : ""
                }`}
                onMouseEnter={() => setHoveredButton("manage")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Manage Events
              </Button>
            </Link>
            <Link href="/admin/property/new">
              <Button
                className={`w-full justify-start transition-all duration-200 ${
                  hoveredButton === "create-property"
                    ? "bg-background text-foreground border border-input"
                    : ""
                }`}
                variant={
                  hoveredButton === "create-property" ? "outline" : "default"
                }
                onMouseEnter={() => setHoveredButton("create-property")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                Create New Property
              </Button>
            </Link>
            <Link href="/admin/property">
              <Button
                variant={
                  hoveredButton === "manage-property" ? "default" : "outline"
                }
                className={`w-full justify-start transition-all duration-200 ${
                  hoveredButton === "manage-property"
                    ? "bg-background text-foreground border border-input"
                    : ""
                }`}
                onMouseEnter={() => setHoveredButton("manage-property")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <BuildingIcon className="mr-2 h-4 w-4" />
                Manage Properties
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">New event created</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Event updated</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    New participant registered
                  </p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
