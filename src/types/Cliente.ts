export class Cliente {
  created_at?: Date;
  updated_at?: Date;
  data_nascimento: string;
  id: number;
  cpf: string;
  nome: string;
  sexo: "masculino" | "feminino" | "";
  enderecos?: Endereco[] = [];
  constructor(params: Cliente) {
    this.created_at = params.created_at;
    this.updated_at = params.updated_at;
    this.data_nascimento = params.data_nascimento;
    this.id = params.id;
    this.cpf = params.cpf;
    this.nome = params.nome;
    this.sexo = params.sexo;
  }
}

export class Endereco {
  localId: string;
  id?: number;
  cliente_id?: number;
  endereco: string;
  UF: string;
  cidade: string;
  constructor(params: Endereco) {
    this.localId = params.localId;
    this.id = params.id;
    this.cliente_id = params.cliente_id;
    this.endereco = params.endereco;
    this.UF = params.UF;
    this.cidade = params.cidade;
  }
}
