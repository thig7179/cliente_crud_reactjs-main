import { BaseResponse } from "../types/Baseresponse";
import { Cliente, Endereco } from "../types/Cliente";
import axios from "axios";

const api = axios.create({ baseURL: "http://127.0.0.1:8000/api" }); //To consume api laravel
class HttpService {
  private catch(message = "Ocorreu algum erro") {
    return new BaseResponse({
      data: [],
      message,
      success: false,
    });
  }

  async listClients(): Promise<BaseResponse<Cliente[]>> {
    try {
      const { data } = await api.get(`/clientes`);
      return data;
    } catch (error) {
      return this.catch();
    }
  }

  async createClient(cliente: Cliente): Promise<BaseResponse<any>> {
    try {
      const result = await api.post(`/cliente`, cliente);

      return result.data;
    } catch (error) {
      return this.catch();
    }
  }

  async updateClient(cliente: Cliente, id: number): Promise<BaseResponse<any>> {
    try {
      const result = await api.put(`/cliente/${id}`, {
        ...cliente,
      });
      return result.data;
    } catch (error) {
      return this.catch();
    }
  }

  async deleteClient(id: number): Promise<BaseResponse<any>> {
    try {
      const result: BaseResponse<any> = await api.delete(`/cliente/${id}`);
      return result.data;
    } catch (error) {
      return this.catch();
    }
  }

  async getCliente(id: number): Promise<BaseResponse<Cliente>> {
    try {
      const { data } = await api.get(`/cliente/${id}`);
      return data;
    } catch (error) {
      return this.catch();
    }
  }

  async createEndereco(
    idUser: number,
    endereco: Endereco
  ): Promise<BaseResponse<any>> {
    try {
      const { data } = await api.post(`/endereco/${idUser}`, endereco);
      return data;
    } catch (error) {
      return this.catch();
    }
  }

  async updateEndereco(
    idUser: number,
    idEndereco: number,
    endereco: Endereco
  ): Promise<BaseResponse<any>> {
    try {
      const { data } = await api.put(
        `/endereco/${idUser}/${idEndereco}`,
        endereco
      );
      return data;
    } catch (error) {
      return this.catch();
    }
  }

  async deleteEndereco(
    idUser: number,
    idAddress: number
  ): Promise<BaseResponse<any>> {
    try {
      const { data } = await api.delete(`/endereco/${idUser}/${idAddress}`);
      return data;
    } catch (error) {
      return this.catch();
    }
  }
}

export const httpService = new HttpService();
