import { useEffect, useMemo, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { format as dateFnsFormat } from "date-fns";
import { useAppcontext } from "../../context/Context";
import { httpService } from "../../services/HttpService";
import { Cliente } from "../../types/Cliente";

export function DialogFormUser() {
  const ctx = useAppcontext();
  const [isOpen, setIsOpen] = useState(true);
  const [cpf, setCpf] = useState(ctx.clienteSelected?.cpf || "");
  const [nome, setNome] = useState(ctx.clienteSelected?.nome || "");
  const [sexo, setSexo] = useState<Cliente["sexo"]>(
    ctx.clienteSelected?.sexo || ""
  );
  const [dataNascimento, setDataNascimento] = useState<Date | null>(
    ctx.clienteSelected?.data_nascimento
      ? new Date(ctx.clienteSelected.data_nascimento)
      : null
  );


  useEffect(() => {
    if (!isOpen) {
      ctx.toggleOpenAddEditUser(false, true);
    }
  }, [isOpen]);

  function handleSubmit() {
    const cliente = new Cliente({
      data_nascimento: dateFnsFormat(dataNascimento as Date, "yyyy-MM-dd"),
      cpf,
      nome,
      sexo,
      id: ctx.clienteSelected?.id || 0,
    });

    if (ctx.clienteSelected) {
      httpService
        .updateClient(cliente, ctx.clienteSelected.id)
        .then((result) => {
          if (result.success) {
            ctx.updateClient(cliente);
          }
        })
        .finally(() => {
          ctx.toggleOpenAddEditUser(false, true);
        });
      return;
    }

    httpService
      .createClient(cliente)
      .then((result) => {
        if (result.success) {
          cliente.id = result.data.id;
          ctx.addClient(cliente);
        }
      })
      .finally(() => {
        ctx.toggleOpenAddEditUser(false, true);
      });
  }

  function handleDateChange(date: Date | null) {
    setDataNascimento(date);
  }

  function isEnablebuttonSubmit() {
    return (
      !!nome && !!sexo && !!dataNascimento && String(dataNascimento) !== "Invalid Date"
    );
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {ctx.clienteSelected?.id ? "Editar cliente" : "Novo cliente"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container spacing={1}>
          <Grid item md={12}>
              <TextField
                autoFocus
                label="Cpf"
                type="text"
                fullWidth
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </Grid>
            <Grid item md={12}>
              <TextField
                autoFocus
                label="Nome"
                type="text"
                fullWidth
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </Grid>
            <Grid item md={12}>
              <FormControl fullWidth>
                <InputLabel>Sexo</InputLabel>
                <Select
                  fullWidth
                  value={sexo}
                  onChange={(e) => setSexo(e?.target?.value as Cliente["sexo"])}
                >
                  <MenuItem value={"masculino"}>Masculino</MenuItem>
                  <MenuItem value={"feminino"}>Feminino</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={12}>
              <KeyboardDatePicker
                disableToolbar
                format="dd/MM/yyyy"
                label="Data de nascimento"
                invalidDateMessage="Formato iválido"
                value={dataNascimento}
                onChange={handleDateChange}
                KeyboardButtonProps={{ "aria-label": "change date" }}
              />
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsOpen(false)} color="secondary">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={!isEnablebuttonSubmit()}
        >
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
