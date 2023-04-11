import {
  createContext,
  useContext,
  PropsWithChildren,
  useCallback,
  useState,
} from "react";
import { httpService } from "../../services/HttpService";
import { Cliente } from "../../types/Cliente";

type AppProviderData = {
  clienteSelected: Cliente | null;
  clientes: Cliente[];
  openAddEditUser: boolean;
  toggleOpenAddEditUser: (open?: boolean, resetSelected?: boolean) => void;
  listClients: () => void;
  removeClient: (id: number) => void;
  addClient: (cliente: Cliente) => void;
  updateClient: (cliente: Cliente) => void;
  selectCliente: (cliente: Cliente) => void;
};

const Context = createContext<AppProviderData>({} as AppProviderData);

export function AppProvider({ children }: PropsWithChildren<{}>) {
  const [clienteSelected, setClienteSelected] = useState<Cliente | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [openAddEditUser, setOpenAddEditUser] = useState(false);
  const listClients = useCallback(() => {
    httpService.listClients().then((response) => {
      setClientes(response.data);
      if (!response.success) {
        alert("Ocorreu algum erro");
      }
    });
  }, []);

  const toggleOpenAddEditUser = useCallback(
    (open?: boolean, resetSelected?: boolean) => {
      setOpenAddEditUser((prev) => open || !prev);
      if (resetSelected) {
        setClienteSelected(null);
      }
    },
    []
  );

  const removeClient = useCallback((id: number) => {
    setClientes((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addClient = useCallback((cliente: Cliente) => {
    setClientes((prev) => [...prev, cliente]);
  }, []);

  const updateClient = useCallback((cliente: Cliente) => {
    setClientes((prev) =>
      prev.map((c) => {
        if (c.id === cliente.id) {
          return cliente;
        }
        return c;
      })
    );
  }, []);

  const selectCliente = useCallback((cliente: Cliente) => {
    setClienteSelected(cliente);
  }, []);

  return (
    <Context.Provider
      value={{
        clienteSelected,
        updateClient,
        selectCliente,
        listClients,
        clientes,
        openAddEditUser,
        toggleOpenAddEditUser,
        removeClient,
        addClient,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useAppcontext() {
  return useContext(Context);
}
