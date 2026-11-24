import React, { use, useEffect, useState } from "react"
import { cn } from "@/utils/cn"
import type { Kinds, Show } from "@/data/watchlist"
import Input from "@/component/Input"
import { MorphIcon } from "morphicons/react"
import { Edit, Loader2, Plus } from "lucide"

type AddShowFormParams = {
    watchlist?: Show[],
    defaultValues?: Omit<Show, "id">,
    onSubmit: (show: Omit<Show, "id">) => Promise<void>
}

const DEFAULT_SHOW_FORM_STATE = {
    submitted: false,
    values: {
        title: "",
        year: 0,
        kind: "serie" as "serie" | "film",
    }
}

const AddShowForm = ({ watchlist, defaultValues, onSubmit }: AddShowFormParams) => {
    const [showFormState, setShowFormState] = useState({ ...DEFAULT_SHOW_FORM_STATE })
    const [loading, setLoading] = useState(false)

    const formErrors = computeErrors(showFormState.values, watchlist)

    useEffect(() => {
        setShowFormState(_ => {
            return {
                ...DEFAULT_SHOW_FORM_STATE,
                values: defaultValues || DEFAULT_SHOW_FORM_STATE.values
            }
        })
    }, [defaultValues])

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()

        setShowFormState(prev => {
            return {
                ...prev,
                submitted: true
            }
        })

        if (Object.values(formErrors).find(v => v.length)) {
            return
        }

        setShowFormState(() => {
            return {
                ...DEFAULT_SHOW_FORM_STATE
            }
        })

        setLoading(true)

        // Note: Shows are always {..., watched: false, review: 0} when they're first added
        // It wouldn't make sense to add an already watched show into a WATCHlist, would it?
        // I'm not sure of this aspect though, so I might change it in future
        await onSubmit({
            ...showFormState.values,
            watched: false,
            review: 0
        })

        setLoading(false)
    }

    return <form className="flex flex-col gap-4 w-sm" onSubmit={handleSubmit}>
        <h1 className="font-bold text-center text-xl">Aggiungi Titolo</h1>
        <Input
            placeholder="Titolo"
            errors={showFormState.submitted && formErrors.title || undefined}
            value={showFormState.values.title}
            onChange={(e) => setShowFormState(prev => {
                return { ...prev, values: { ...prev.values, title: e.target.value } }
            })}
            className="bg-gray-200 p-2 rounded-lg w-full"></Input>
        <Input
            placeholder="Anno"
            errors={showFormState.submitted && formErrors.year || undefined}
            type="number"
            value={showFormState.values.year.toString()}
            onChange={(e) => setShowFormState(prev => {
                return { ...prev, values: { ...prev.values, year: +e.target.value } }
            })}
            className="bg-gray-200 p-2 rounded-lg w-full"></Input>
        <div className="flex gap-4">
            {["film", "serie"].map(filtro =>
                <button
                    key={filtro}
                    type="button"
                    className={cn("px-4 py-2 bg-gray-400 rounded-full", {
                        "bg-blue-400": showFormState.values.kind === filtro
                    })
                    }
                    onClick={() => setShowFormState(prev => {
                        return { ...prev, values: { ...prev.values, kind: filtro as Kinds } }
                    })}
                >{filtro}</button>)
            }
        </div>
        <button className="rounded-full px-4 py-2 bg-blue-400 flex gap-2 items-center justify-center"><MorphIcon className={cn(loading && "animate-spin")} icon={loading ? Loader2 : defaultValues ? Edit : Plus} /> <span>{defaultValues ? "Modifica" : "Aggiungi"}</span></button>
    </form>
}

function computeErrors(values: { title: string, year: number }, watchlist?: Show[]): { title: string[], year: string[] } {
    const errors = {
        title: [] as string[],
        year: [] as string[]
    }

    if (values.title === "") {
        errors.title = ["Titolo obbligatorio!"]
    } else {
        if (values.title.trim().length < 2) {
            errors.title = ["Il titolo deve contenere almeno 2 caratteri!"]
        }

        if (/[!£$"%&/()=?^"]/.test(values.title)) {
            errors.title = [...errors.title, "Il titolo non può contenere caratteri speciali!"]
        }

        if (watchlist?.find(value => value.title.toLowerCase() === values.title.trim().toLowerCase())) {
            errors.title = [...errors.title, "Lo show è già nella lista!"]
        }
    }

    if (values.year < 1900 || values.year > new Date().getFullYear()) {
        errors.year = [`L'anno deve essere compreso tra il 1900 e il ${new Date().getFullYear()}!`]
    }

    return errors
}

export default AddShowForm