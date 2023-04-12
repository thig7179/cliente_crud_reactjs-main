import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import { toast } from "react-toastify";
import { httpService } from "../../../services/HttpService";
import { Cliente, Endereco } from "../../../types/Cliente";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

type Props = {
  cliente: Cliente;
  enderecos: Endereco;
  removeItem: (id: string) => void;
};
type IBGEUFResponse = {
  sigla: string;
  nome: string;
};
type IBGECITYResponse = {
  id: number;
  nome: string;
};
export function FormAddress({ cliente, enderecos, removeItem }: Props) {
  const [localId, setLocalId] = useState(enderecos.localId || "");
  const [isEdit, setIsEdit] = useState(!enderecos.id || false);
  const [endereco, setEndereco] = useState(enderecos.endereco || "");
  const [ufs, setUfs] = useState<IBGEUFResponse[]>([]);
  const [cities, setCities] = useState<IBGECITYResponse[]>([]);
  const [UF, setSelectedUf] = useState(enderecos.UF || "0");
  const [cidade, setSelectedCity] = useState(enderecos.cidade || "0");
  function handleSubmit() {
    const enderecoToSend = new Endereco({
      localId,
      endereco,
      UF,
      cidade,
    });
    if (enderecos.id) {
      httpService
        .updateEndereco(cliente.id, enderecos.id, enderecoToSend)
        .then((response) => {
          if (response.success) {
            toast("Endereço atualizado");
          }
        });
    } else {
      httpService
        .createEndereco(cliente.id, enderecoToSend)
        .then((response) => {
          if (response.success) {
            toast("Endereço criado com sucesso");
          }
        });
    }

    setIsEdit(false);
  }

  function isEnablebuttonSubmit() {
    return !!endereco && !!UF && !!cidade;
  }

  

  function removeThis() {
    if (enderecos.id) {
      httpService.deleteEndereco(cliente.id, enderecos.id).then(() => {
        toast("Endereço removido");
      });
    }
    removeItem(enderecos.localId);
  }

  useEffect(() => {
    if (UF === "0") {
      return;
    }
    axios
      .get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UF}/municipios`
      )
      .then((response) => {
        setCities(response.data);
      });
  });

  useEffect(() => {
    axios
      .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/")
      .then((response) => {
        setUfs(response.data);
      });
  }, [UF]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }
  return (
    <Grid container spacing={1}>
      <Grid item md={12}>
        <Grid container>
          <Grid item md={6}>
            <IconButton
              edge="start"
              onClick={() => {
                setIsEdit((prev) => !prev);
              }}
            >
              {!isEdit ? <EditIcon /> : <CloseIcon />}
            </IconButton>
          </Grid>
          <Grid item md={6}>
            {isEdit && (
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="flex-start"
              >
                <IconButton edge="start" color="secondary" onClick={removeThis}>
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  disabled={!isEnablebuttonSubmit()}
                  edge="start"
                  color="primary"
                  onClick={handleSubmit}
                >
                  <SaveIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={6}>
        <TextField
          disabled={!isEdit}
          label="Endereco"
          type="text"
          fullWidth
          value={endereco}
          onChange={(e: { target: { value: SetStateAction<string>; }; }) => setEndereco(e.target.value)}
        />
      </Grid>
      <Grid item md={6}>
        <select
        className="form-select"
        disabled={!isEdit} 
        name="uf" 
        id="uf"
        value={UF} 
        onChange={handleSelectUf}>
          <option value="0">Selecione uma UF</option>
          {ufs.map((uf) => (
            <option value={uf.sigla}>{uf.nome}</option>
          ))}
        </select>
      </Grid>
      <Grid item md={6}>
        <select
          disabled={!isEdit}
          name="City"
          id="City"
          value={cidade}
          onChange={handleSelectCity}
        >
          <option value="0">Selecione uma cidade</option>
          {cities.map((city) => (
            <option key={city.id} value={city.nome}>
              {city.nome}
            </option>
          ))}
        </select>
      </Grid>
    </Grid>
  );
}
