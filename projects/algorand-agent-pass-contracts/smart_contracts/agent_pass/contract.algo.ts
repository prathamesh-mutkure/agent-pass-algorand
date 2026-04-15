import { Contract } from '@algorandfoundation/algorand-typescript'

export class AgentPass extends Contract {
  hello(name: string): string {
    return `Hello, ${name}`
  }
}
