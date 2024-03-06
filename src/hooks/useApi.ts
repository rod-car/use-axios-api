import axios from "./axios";
import { useState } from "react"

type APIProps = {
    url: string;
    key?: string;
    baseUrl?: string;
};

type APIError = {
    message: string;
    status: number;
};

type RequestState = {
    loading?: boolean;
    creating?: boolean;
    updating?: boolean;
    deleting?: boolean;
}

/**
 * Description placeholder
 *
 * @export
 * @template T Type de l'entite a obtenir
 * @param {string} param.baseUrl Url de base de l'API
 * @param {string} param.url Url de la ressources en enlevant la base
 * @param {string} param.key Cle contenant le data retourne par le serveur
 */
export function useApi<T>({ baseUrl = '', url, key = undefined }: APIProps) {
    axios.defaults .baseURL = baseUrl

    const [data, setData] = useState<T | null>(null);
    const [datas, setDatas] = useState<T[]>([]);
    const [error, setError] = useState<APIError | null>(null);
    const [success, setSuccess] = useState(false);
    const [RequestState, setRequestState] = useState<RequestState>({
        loading: false,
        creating: false,
        deleting: false,
        updating: false
    })

    const resetError = () => {
        setError(null)
    }

    const resetSuccess = () => {
        setError(null)
    }

    const resetRequestState = () => {
        setRequestState({
            loading: false,
            creating: false,
            deleting: false,
            updating: false
        });
    }

    const reset = () => {
        resetRequestState();
        resetError();
        resetSuccess();
        setDatas([]);
    }

    
    /**
     * 
     * @param params 
     * @returns 
     */
    const buildQuery = (params: Record<string, string | number> | undefined): string | undefined => {

        if (!params) return undefined;

        const queryParams: string[] = [];
        Object.keys(params).map(param => {
            queryParams.push(`${param}=${params[param]}`);
        });

        return "?" + queryParams.join("&").toString();
    }


    /**
     * Recuperer une liste des donnees
     * 
     * @param {Record<string, any>} params
     */
    const get = async (params?: Record<string, string | number>) => {
        reset();
        setRequestState({ loading: true });

        const query = buildQuery(params);
        
        try
        {
            if (query) url += query;

            const response = await axios.get(url);
            if (response.status === 200) setDatas(key ? response.data[key] : response.data);
            else setError({
                message: response.statusText,
                status: response.status
            });
        }
        catch (e)
        {
            setError(e as APIError)
        }

        setRequestState({ loading: false });
    }

    /**
     * Find any resource by ID
     * @param { string | number } id
     * @param params Query parameters
     */
    const find = async (id: string | number, params?: Record<string, string | number>) => {
        reset();
        setRequestState({ loading: true });

        const query = buildQuery(params);
        
        try
        {
            let newUrl = url + '/' + id
            if (query) newUrl += query;

            const response = await axios.get(newUrl);
            if (response.status === 200) setData(response.data);
            else setError({
                message: response.statusText,
                status: response.status
            });
        }
        catch (e)
        {
            setError(e as APIError)
        }

        setRequestState({ loading: false });
    }

    
    /**
     * Enregistrer un nouveau enregistrement dans la base de données
     * @param {string} data
     * @async
     */
    const post = async (data: Omit<T, "id">) => {
        reset();
        setRequestState({ creating: true });

        try
        {
            const response = await axios.post(url, data, {
                headers: {
                    "Content-Type": "application/ld+json"
                }
            });
    
            if (response.status === 201) {
                setSuccess(true);
                setData(response.data);
            } else {
                setError({
                    message: response.statusText,
                    status: response.status
                });
            }
        }
        catch (e)
        {
            setError(e as APIError);
        }
        
        setRequestState({ creating: false });
    }


    /**
     * Faire une mise a jour complete d'un enregistrement dans la base de donnees
     * 
     * @param {string | number} id Identifiant de l'enregistrement a modifier
     * @param {Omit<T, "id">} data Les nouvelles valeurs
     */
    const put = async (id: string | number, data: Omit<T, "id">) => {
        reset();
        setRequestState({ updating: true });

        try
        {
            const response = await axios.put(getUri(id), data, {
                headers: {
                    "Content-Type": "application/ld+json"
                }
            });

            if (response.status === 200) {
                setSuccess(true);
                setData(response.data);
            } else {
                setError({
                    message: response.statusText,
                    status: response.status
                });
            }
        }
        catch (e)
        {
            setError(e as APIError);
        }

        setRequestState({ updating: false });
    }


    /**
     * Permet de faire un remplacement partiel d'un enregistrement
     * 
     * @param {string | number} id Identifiant de l'enregistrement a modifier
     * @param {Partial<Omit<T, "id">>} data Les nouvelles valeurs
     */
    const patch = async (id: string | number, data: Partial<Omit<T, "id">>) => {
        reset();
        setRequestState({ updating: true });

        try
        {
            const response = await axios.patch(getUri(id), data, {
                headers: {
                    "Content-Type": "application/merge-patch+json"
                }
            });

            if (response.status === 200) {
                setSuccess(true);
                setData(response.data);
            } else {
                setError({
                    message: response.statusText,
                    status: response.status
                });
            }
        }
        catch (e)
        {
            setError(e as APIError);
        }

        setRequestState({ updating: false });
    }

    const destroy = async (id: string | number) => {
        reset();
        setRequestState({ deleting: true });

        try
        {
            const response = await axios.delete(getUri(id));
    
            if (response.status === 204) {
                setSuccess(true);
                setData(null);
            } else {
                setError({
                    message: response.statusText,
                    status: response.status
                });
            }
        }
        catch (e)
        {
            setError(e as APIError);
        }
        
        setRequestState({ deleting: false });
    }


    /**
     * Recuperer l'URI
     * 
     * @param {string | number} id
     * @returns
     */
    const getUri = (id: string | number): string => url + '/' + id;

    return {
        resetError,
        datas, data,
        RequestState,
        error, success,
        Client: {
            get, post, put, find, patch, destroy
        }
    }

}