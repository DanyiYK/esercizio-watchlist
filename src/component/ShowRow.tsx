import { useState } from "react";
import { cn } from "@/utils/cn";
import type { Show } from "@/data/watchlist";

type ShowRowProps = {
    show: Show,
    onClick: () => void
}

export function ShowRow({ show, onClick }: ShowRowProps) {
    const [stars, setStars] = useState(0)
    const [watched, setWatched] = useState(false)

    return (
        <div onClick={onClick} className="flex justify-between items-center px-4 py-2 border border-gray-400 rounded-lg w-full">
            <div className="flex flex-col justify-between items-center w-full">
                <div className="flex flex-col w-full">
                    <p className={cn("font-bold capitalize", watched && "line-through")}>{show.title}</p>
                    <p className="opacity-75">{show.year}</p>
                </div>
                <div className="text-3xl select-none w-full flex items-center">
                    {[1, 2, 3, 4, 5].map(value => <span key={value} className={cn("text-gray-400 duration-75 hover:opacity-75", value <= stars && "text-yellow-500")} onClick={e => {
                        e.stopPropagation();

                        if (stars === value) return setStars(0);

                        setStars(value)

                    }}>★</span>)}
                </div>
            </div>
            <div className="flex items-center justify-center gap-2">
                <span className={cn("rounded-full text-center px-3 text-black/90 capitalize", {
                    "bg-yellow-200": show.kind === 'film',
                    "bg-purple-200": show.kind === 'serie',
                })}>{show.kind}</span>
                <input type="checkbox" checked={watched} onClick={e => e.stopPropagation()} onChange={e => { setWatched(e.target.checked) }} />
            </div>
        </div>
    );
}