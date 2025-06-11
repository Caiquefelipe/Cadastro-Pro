import { ICliente } from 'src/interfaces/ICliente'
import axios from 'axios'

class ServicoClientes {
  async pegarClientes(): Promise<ICliente[]> {
    const response = await axios.get('http://localhost:5001/clientes')
    return response.data.clientes
  }

  async adicionarCliente(data: ICliente) {
    const response = await axios.post('http://localhost:5001/clientes', data)
    return response.data.clientes
  }

  async editarCliente(data: ICliente) {
    const response = await axios.put(`http://localhost:5001/clientes/${data.id}`, data)
    return response.data
  }

  async pegarClientePorId(id: number): Promise<ICliente> {
    const response = await axios.get(`http://localhost:5001/clientes/${id}`)
    return response.data
  }
  async deletarCliente(id: number): Promise<ICliente[]> {
    const response = await axios.delete(`http://localhost:5001/clientes/${id}`)
    return response.data.clientes
  }
}
export default new ServicoClientes()
