import { ICliente } from 'src/interfaces/ICliente'
import axios from 'axios'

class ServicoClientes {
  // Função para pegar um cliente
  async pegarClientes(): Promise<ICliente[]> {
    const response = await axios.get('http://localhost:5001/clientes')
    return response.data
  }

  async adicionarCliente(data: ICliente) {
    const response = await axios.post('http://localhost:5001/clientes', data)
    return response.data
  }

  async pegarClientePorId(id: number): Promise<ICliente> {
    const response = await axios.get(`http://localhost:5001/clientes/${id}`)
    return response.data
  }
}
export default new ServicoClientes()
