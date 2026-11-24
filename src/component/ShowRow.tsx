import type { Show } from "@/data/watchlist";
import { cn } from "@/utils/cn";
import { Edit, Loader2 } from "lucide-react";
import { useState } from "react";

type ShowRowProps = {
    show: Show,
    disabled?: boolean,
    onClick: () => void,
    onEdit: () => void,
    showUpdated: (show: Show) => Promise<void>,
}

export function ShowRow({ show, onClick, onEdit, showUpdated }: ShowRowProps) {
    const [disabled, setDisabled] = useState(false)

    async function showUpdatedWrapper(show: Show) {
        setDisabled(true)
        await showUpdated(show)
        setDisabled(false)
    }

    return (
        <div onClick={onClick} className={cn("flex justify-between items-center px-4 py-2 border border-gray-400 rounded-lg w-full", disabled && "opacity-50")}>
            {disabled ? <Loader2 className="animate-spin mx-auto my-7" /> : <>
                <div className="flex flex-col justify-between items-center w-full">
                    <div className="flex flex-col w-full">
                        <p className={cn("font-bold capitalize", show.watched && "line-through")}>{show.title}</p>
                        <p className="opacity-75">{show.year}</p>
                    </div>
                    <div className="text-3xl select-none w-full flex items-center">
                        {[1, 2, 3, 4, 5].map(value => <button type="button" disabled={disabled} key={value} className={cn("text-gray-400 duration-75 hover:opacity-75", value <= show.review && "text-yellow-500")} onClick={e => {
                            e.stopPropagation();


                            if (show.review === value) return showUpdatedWrapper({ ...show, review: 0 });

                            showUpdatedWrapper({ ...show, review: value })

                        }}>★</button>)}
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <span className={cn("rounded-full text-center px-3 text-black/90 capitalize", {
                        "bg-yellow-200": show.kind === 'film',
                        "bg-purple-200": show.kind === 'serie',
                    })}>{show.kind}</span>
                    <button onClick={e => { e.stopPropagation(); onEdit() }} type="button" className="p-1 rounded-lg bg-gray-300 hover:opacity-75 duration-75 hover:cursor-pointer">
                        <Edit />
                    </button>
                    <input className="hover:cursor-pointer" disabled={disabled} type="checkbox" checked={show.watched} onClick={e => e.stopPropagation()} onChange={e => { showUpdatedWrapper({ ...show, watched: e.target.checked }) }} />
                </div>
            </>}
        </div>
    );
}