import React, { useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import { Cliente, Endereco } from "../../types/Cliente";
import { FormAddress } from "./FormAddress";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { httpService } from "../../services/HttpService";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: "relative",
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    container: {
      padding: theme.spacing(2),
    },
    p3: {
      padding: theme.spacing(3),
    },
  })
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
  cliente: Cliente;
  close: () => void;
};
export function DialogDetailClient({ cliente, close }: Props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);

  function addEndereco() {
    setEnderecos((prev) => [
      ...prev,
      {
        endereco: "",
        UF: "",
        cidade: "",
        localId: uuidv4(),
      },
    ]);
  }

  useEffect(() => {
    httpService.getCliente(cliente.id).then((response) => {
      const clienteEnderecos = response.data?.enderecos || [];
      setEnderecos(
        clienteEnderecos.map((item) => ({ ...item, localId: uuidv4() }))
      );
    });
  }, []);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        close();
      }, 750);
    }
  }, [open]);

  function handleClose() {
    setOpen(false);
  }

  function removeFromList(localId: string) {
    setEnderecos((prev) => prev.filter((end) => localId !== end.localId));
  }

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Detalhes do cliente
          </Typography>
          <Button
            autoFocus
            color="secondary"
            variant="contained"
            onClick={addEndereco}
          >
            Adicionar endereço
          </Button>
        </Toolbar>
      </AppBar>
      <Grid container className={classes.container}>
        <Grid item md={3}>
          <Paper className={classes.container} style={{ margin: 5 }}>
            <small>cpf:</small>
            <Typography variant="h6">{cliente.cpf}</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid container className={classes.container}>
        <Grid item md={3}>
          <Paper className={classes.container} style={{ margin: 5 }}>
            <small>Nome:</small>
            <Typography variant="h6">{cliente.nome}</Typography>
          </Paper>
        </Grid>
        <Grid item md={3}>
          <Paper className={classes.container} style={{ margin: 5 }}>
            <small>Data nascimento:</small>
            <Typography variant="h6">
              {format(new Date(cliente.data_nascimento), "dd/MM/yyyy")}
            </Typography>
          </Paper>
        </Grid>
        <Grid item md={3}>
          <Paper className={classes.container} style={{ margin: 5 }}>
            <small>Sexo:</small>
            <Typography variant="h6">{cliente.sexo}</Typography>
          </Paper>
        </Grid>
        <Divider />
        {enderecos.map((endereco) => {
          return (
            <Grid item md={6} key={endereco.localId}>
              <Paper className={classes.p3} style={{ margin: 5 }}>
                <FormAddress
                  cliente={cliente}
                  enderecos={endereco}
                  removeItem={removeFromList}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Dialog>
  );
}
