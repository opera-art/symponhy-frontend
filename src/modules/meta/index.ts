/**
 * Meta Integration Module
 *
 * Este módulo implementa a integração com a API do Meta (Instagram/Facebook)
 * seguindo a arquitetura DDD (Domain-Driven Design).
 *
 * Estrutura:
 * - domain/       -> Entidades, Value Objects, interfaces de repositórios
 * - application/  -> Use cases, DTOs, serviços de aplicação
 * - infrastructure/ -> Implementações concretas (API client, repositórios)
 * - presentation/ -> API routes, controllers
 */

// Domain exports
export * from './domain/entities';
export * from './domain/value-objects';
export * from './domain/repositories';
export * from './domain/errors';

// Application exports
export * from './application/use-cases';
export * from './application/dtos';
export * from './application/services';

// Infrastructure exports
export * from './infrastructure/meta-api';
export * from './infrastructure/repositories';

// Presentation (API handlers)
export * from './presentation';

// Config
export * from './config';
