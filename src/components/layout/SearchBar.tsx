"use client"

import { searchType } from "@/api/VideoApi"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import { selectSearch } from "@/contexts/search/searchSlice"
import { Search, SlidersHorizontal } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { createSearchParams, useNavigate } from "react-router"

type SortByType = "views" | "createdAt"
type SortOrder = "asc" | "desc"

export const SearchBarDesktop: React.FC = () => {
  const {type,query} = useSelector(selectSearch);
  const [active, setActive] = useState<boolean>(false)
  const [searchType,setSearchType] = useState<searchType>(type)
  const [sortBy, setSortBy] = useState<SortByType>("views")
  const [sortType, setSortType] = useState<SortOrder>("asc")
  const [search, setSearch] = useState<string>(query)

  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
useEffect(() => {
  setSearch(query);
  setSearchType(type);
}, [query,type]);
 
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
    if (query.trim() === "") {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }else{
      const searchParams = createSearchParams();
      searchParams.set("query",search);
      searchParams.set("sortType",sortType);
      searchParams.set("sortBY",sortBy);
      searchParams.set("type",searchType);
      navigate(`/search?${searchParams}`)
    }
  }
  return (
    <form
      
      className="flex w-full justify-center items-center flex-1"
      onSubmit={handleSubmit}
    >
      {/* Text Input */}
      <span className="max-h-full relative">
        <input
          tabIndex={0}
          id="searchText"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value )
          }
          type="text"
          name="query"
          autoCorrect="true"
          placeholder="search here...."
          draggable={false}
          ref={inputRef}
          onFocusCapture={()=>setActive(true)}
          className="hidden md:block  py-3 px-5 bg-background border-[.15rem] border-accent text-[1.4rem] rounded-lg border-r-0 rounded-r-none focus-visible:ring-transparent text-accent-foreground selection:text-blue-900 selection:bg-blue-400 h-full md:w-full"
          />
         { active && <Popover  modal >
        <PopoverTrigger className="absolute bottom-0 right-0">
          <Button asChild
          onBlurCapture={() => setActive(false)}
            variant="ghost"
            className="h-12 w-12 md:bg-accent border-2 border-background/12 rounded-lg"
            onFocusCapture={(e)=>{e.stopPropagation(); setActive(true)}}
          >
            <SlidersHorizontal className="text-accent-foreground w-full h-full" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] space-y-3">
          {/* Type Selector */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Type</label>
            <Select value={searchType} onValueChange={(value: searchType) => setSearchType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vid">Video</SelectItem>
                <SelectItem value="chnl">Channel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By Selector */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Sort By</label>
            <Select value={sortBy} onValueChange={(value: SortByType) => setSortBy(value)}>
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
            <Select value={sortType} onValueChange={(value: SortOrder) => setSortType(value)}>
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
      </Popover>}
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
          className={`h-12 w-12 md:bg-accent border-2 border-background/12 border-l-0 rounded-l-none ${
            active ? "border-accent-foreground" : ""
          }`}
        >
          <Search className="text-accent-foreground w-full h-full" />
        </Button>
      
    </form>
  )
}
