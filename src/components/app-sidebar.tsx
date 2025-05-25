"use client"
import * as React from "react"
import { useRouter } from "next/navigation";
import { SearchForm } from "@/components/search-form"
import Cookies from 'js-cookie'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/",
          isActive: true,
        },
        {
          title: "Data Center",
          url: "/data-center",
        },
        {
          title: "User",
          url: "/user",
        },

        {
          title: "Auth",
          url: "/auth",
        },
        {
          title: "Logout",
          url: "#",
        },
      ],
    },

  ],
}

export function  AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const handleLogout = () => {
    console.log("logout")
    Cookies.remove('userSession')

    router.push("/login")

  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>

        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        asdasdas
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  item.title.toLowerCase() !=='logout' ?
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem> : 
                  <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild >
                    <button className="text-left text-red-500 hover:text-red-500 hover:bg-red-100" onClick={handleLogout}>logout</button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}


      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
