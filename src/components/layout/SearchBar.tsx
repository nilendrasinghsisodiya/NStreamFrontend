"use client";

import { searchType } from "@/api/VideoApi";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { selectSearch } from "@/contexts/search/searchSlice";
import { Search, SlidersHorizontal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { createSearchParams, useNavigate } from "react-router";

type SortByType = "views" | "createdAt";
type SortOrder = "asc" | "desc";

export const SearchBarDesktop: React.FC = () => {
  const { type, query } = useSelector(selectSearch);
  const [active, setActive] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<searchType>(type);
  const [sortBy, setSortBy] = useState<SortByType>("views");
  const [sortType, setSortType] = useState<SortOrder>("asc");
  const [search, setSearch] = useState<string>(query);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    setSearch(query);
    setSearchType(type);
  }, [query, type]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim() === "") {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      const searchParams = createSearchParams();
      searchParams.set("query", search);
      searchParams.set("sortType", sortType);
      searchParams.set("sortBY", sortBy);
      searchParams.set("type", searchType);
      navigate(`/search?${searchParams}`);
    }
  };
  return (
    <form
      onFocusCapture={() => setActive(true)}
      onBlurCapture={() => setActive(false)}
      className="flex w-full justify-center items-center flex-1 h-12 "
      onSubmit={handleSubmit}
    >
      {/* Text Input */}
      <span className="h-full w-5/6 relative">
        <input
          tabIndex={0}
          id="searchText"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          type="text"
          name="query"
          autoCorrect="true"
          placeholder="search here...."
          draggable={false}
          ref={inputRef}
          className={` py-3 px-5  border-[.15rem] border-accent bg-transparent text-[1.4rem] rounded-lg border-r-0 rounded-r-none focus-visible:ring-0 ${
            active && "border-2 border-r-0 border-foreground/80"
          } focus-visible:outline-0 text-accent-foreground selection:text-blue-900 selection:bg-blue-400 h-full w-full`}
        />
        <Popover
          onOpenChange={(open) => console.log("Popover open state:", open)}
        >
          <PopoverTrigger className="h-7 w-7 border-2 border-transparent rounded-lg self-center absolute right-0.5 " >
            <Button
            asChild
            variant={"ghost"}
            className="h-full w-full p-0 bg-transparent"
              tabIndex={0}
              
              
            >
              <SlidersHorizontal className="fill-foreground w-full h-full" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
          
            
            className="w-fit space-y-3 h-fit bg-accent "
          >
            {/* Type Selector */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={searchType}
                onValueChange={(value: searchType) => setSearchType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="w-full h-full">
                  <SelectItem value="vid">Video</SelectItem>
                  <SelectItem value="chnl">Channel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By Selector */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Sort By</label>
              <Select
                value={sortBy}
                onValueChange={(value: SortByType) => setSortBy(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="views">Views</SelectItem>
                  <SelectItem value="createdAt">Created At</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Type Selector */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Sort Type</label>
              <Select
                value={sortType}
                onValueChange={(value: SortOrder) => setSortType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
      </span>

      {/* Hidden Inputs for Filter Params */}
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="sortBy" value={sortBy} />
      <input type="hidden" name="sortType" value={sortType} />

      {/* Filter Popover */}

      {/* Submit Button */}

      <Button
        tabIndex={0}
        variant="ghost"
        type="submit"
        className={`h-full w-1/6  border-2 border-accent  rounded-l-none ${
          active ? "border-accent-foreground/80" : ""
        }`}
      >
        <Search className="text-accent-foreground w-full h-full" />
      </Button>
    </form>
  );
};


export const SearchBarMobile =()=>{
  return <>
    <Popover>
      <PopoverTrigger className="h-fit w-fit">
        <Button asChild variant={"ghost"} className="bg-transparent h-5 w-5"><Search className="h-full w-full text-foreground hover:text-accent" /></Button>
      </PopoverTrigger>
      <PopoverContent className="h-fit w-fit p-3">
        <span className="h-fit w-fit">
          <SearchBarDesktop/>
        </span>
      </PopoverContent>
    </Popover>
  </>
}