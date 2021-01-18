import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    // TODO
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    // TODO

    const product = this.ormRepository.findOne({
      where: { name },
    });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    // TODO
    const productIds = products.map(product => product.id);

    const existentproducts = await this.ormRepository.find({
      where: {
        id: In(productIds),
      },
    });

    return existentproducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    // TODO
    const items = await this.ormRepository.findByIds(products.map(p => p.id));

    return Promise.all(
      items.map(async item => {
        const product = products.find(p => p.id === item.id);

        if (product) {
          const p = item;
          p.quantity = item.quantity - product.quantity;

          await this.ormRepository.save(p);

          return p;
        }

        return item;
      }),
    );
  }
}

export default ProductsRepository;
