import React, { useState } from "react"
import { cn } from "../utils/cn"
import type { Kinds, Show } from "../data/watchlist"
import Input from "./Input"

type AddShowFormParams = {
    watchlist?: Show[],
    onSubmit: (show: Omit<Show, "id">) => void
}

const DEFAULT_SHOW_FORM_STATE = {
    values: {
        title: "",
        year: 0,
        kind: "serie" as "serie" | "film"
    }
}

const AddShowForm = ({ watchlist, onSubmit }: AddShowFormParams) => {
    const [showFormState, setShowFormState] = useState({ ...DEFAULT_SHOW_FORM_STATE })
    const formErrors = computeErrors(showFormState.values, watchlist)

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()

        if (Object.values(formErrors).find(v => v.length)) {
            return
        }

        setShowFormState(_ => {
            return {
                ...DEFAULT_SHOW_FORM_STATE
            }
        })

        onSubmit({ ...showFormState.values })
    }

    return <form className="flex flex-col gap-4 w-sm" onSubmit={handleSubmit}>
        <h1 className="font-bold text-center text-xl">Aggiungi Titolo</h1>
        <Input
            placeholder="Titolo"
            errors={formErrors.title}
            value={showFormState.values.title}
            onChange={(e) => setShowFormState(prev => {
                return { ...prev, values: { ...prev.values, title: e.target.value } }
            })}
            className="bg-gray-200 p-2 rounded-lg w-full"></Input>
        <Input
            placeholder="Anno"
            errors={formErrors.year}
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
                    onClick={_ => setShowFormState(prev => {
                        return { ...prev, values: { ...prev.values, kind: filtro as Kinds } }
                    })}
                >{filtro}</button>)
            }
        </div>
        <button className="rounded-full px-4 py-2 bg-blue-400">Aggiungi</button>
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