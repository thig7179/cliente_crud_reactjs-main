import { SetStateAction, useState } from "react";
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

type Props = {
  cliente: Cliente;
  enderecos: Endereco;
  removeItem: (id: string) => void;
};
export function FormAddress({ cliente, enderecos, removeItem }: Props) {
  const [localId, setLocalId] = useState(enderecos.localId || "");
  const [isEdit, setIsEdit] = useState(!enderecos.id || false);
  const [endereco, setEndereco] = useState(enderecos.endereco || "");
  const [UF, setUF] = useState(enderecos.UF || "");
  const [cidade, setCidade] = useState(enderecos.cidade || "");
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
  function states(){
    return fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/distritos`)
    .then(response => response.json())
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
        <TextField
          disabled={!isEdit}
          label="UF"
          type="text"
          fullWidth
          value={UF}
          onChange={(e: { target: { value: SetStateAction<string>; }; }) => setUF(e.target.value)}
        />
      </Grid>
      <Grid item md={6}>
        <TextField
          disabled={!isEdit}
          label="Cidade"
          type="text"
          fullWidth
          value={cidade}
          onChange={(e: { target: { value: SetStateAction<string>; }; }) => setCidade(e.target.value)}
        />
      </Grid>
    </Grid>
  );
}
