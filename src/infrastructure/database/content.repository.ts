import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from '../../domain/entities/content.entity';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class ContentRepository {
  private readonly logger = new Logger(ContentRepository.name);

  constructor(
    @InjectRepository(Content)
    private readonly repo: Repository<Content>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  // Crear contenido
  async create(content: Partial<Content>): Promise<Content> {
    try {
      // Asegurándonos de que el contenido tenga las propiedades correctas
      if (!content.prompt) {
        content.prompt = '';  // Si no hay 'prompt', lo dejamos vacío por defecto
      }

      return await this.repo.save(content);  // Guarda el contenido en la base de datos
    } catch (error) {
      this.logger.error('Error al crear contenido:', error.message);
      throw new Error('No se pudo crear el contenido');
    }
  }

  // Obtener todos los contenidos
  async findAll(): Promise<Content[]> {
    try {
      return await this.repo.find({ relations: ['creator'] });  // Obtiene todos los contenidos con la relación de 'creator'
    } catch (error) {
      this.logger.error('Error al obtener todos los contenidos:', error.message);
      throw new Error('No se pudieron obtener los contenidos');
    }
  }

  // Obtener contenido por ID
  async findOne(id: string): Promise<Content> {
    try {
      const content = await this.repo.findOne({ where: { id }, relations: ['creator'] });
      if (!content) {
        throw new NotFoundException(`Content with ID ${id} not found`);
      }
      return content;
    } catch (error) {
      this.logger.error(`Error al obtener contenido con ID ${id}:`, error.message);
      throw error;  // Rethrow to be caught by the service layer
    }
  }

  // Buscar contenido por creatorId
  async findByCreator(creatorId: string): Promise<Content[]> {
    try {
      return await this.repo.find({
        where: { creator: { userId: creatorId } },
        relations: ['creator'],
      });
    } catch (error) {
      this.logger.error(`Error al buscar contenido para el creador con ID ${creatorId}:`, error.message);
      throw new Error('No se pudo obtener el contenido del creador');
    }
  }

  // Actualizar contenido
  async update(id: string, updateData: Partial<Content>): Promise<Content> {
    // Intentamos encontrar el contenido antes de actualizarlo
    const content = await this.repo.findOne({ where: { id } });
    
    // Si no se encuentra el contenido, lanzamos una excepción
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    // Actualizamos el contenido con los nuevos datos
    await this.repo.update(id, updateData);
    
    // Devolvemos el contenido actualizado
    const updatedContent = await this.repo.findOne({ where: { id } });
    if (!updatedContent) {
      throw new NotFoundException(`Content with ID ${id} not found after update`);
    }
    return updatedContent;
  }

  // Eliminar contenido
  async delete(id: string): Promise<void> {
    try {
      const content = await this.repo.findOne({ where: { id } });
      if (!content) {
        throw new NotFoundException(`Content with ID ${id} not found`);
      }
      await this.repo.delete(id);
    } catch (error) {
      this.logger.error(`Error al eliminar contenido con ID ${id}:`, error.message);
      throw new Error('No se pudo eliminar el contenido');
    }
  }
}
