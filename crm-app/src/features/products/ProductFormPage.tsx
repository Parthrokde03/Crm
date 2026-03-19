import { Paper, TextInput, NumberInput, Textarea, Switch, Button, Group, Stack, SimpleGrid, Center, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { useCrudQuery } from '../../hooks/use-crud-query';
import { productsApi } from '../../services/api';
import type { Product } from '../../types';

export function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [initialized, setInitialized] = useState(false);
  const { createMutation, updateMutation } = useCrudQuery<Product>('products', productsApi);

  const { data: existing, isLoading } = useQuery({ queryKey: ['products', id], queryFn: () => productsApi.getById(id!), enabled: isEdit });

  const form = useForm({
    initialValues: { name: '', sku: '', description: '', unitPrice: 0, currency: 'USD', category: '', isActive: true },
    validate: { name: (v) => (v.trim() ? null : 'Required'), sku: (v) => (v.trim() ? null : 'Required'), unitPrice: (v) => (v > 0 ? null : 'Must be > 0') },
  });

  useEffect(() => {
    if (isEdit && existing && !initialized) {
      form.setValues({ name: existing.name, sku: existing.sku, description: existing.description ?? '', unitPrice: existing.unitPrice, currency: existing.currency, category: existing.category ?? '', isActive: existing.isActive });
      setInitialized(true);
    }
  }, [existing, isEdit, initialized]);
  if (isEdit && isLoading) return <Center py="xl"><Loader /></Center>;

  const handleSubmit = form.onSubmit((values) => {
    if (isEdit) updateMutation.mutate({ id: id!, data: values as unknown as Partial<Product> }, { onSuccess: () => navigate('/products') });
    else createMutation.mutate(values as unknown as Partial<Product>, { onSuccess: () => navigate('/products') });
  });

  return (
    <>
      <PageHeader title={isEdit ? 'Edit Product' : 'New Product'} subtitle={isEdit ? `Editing ${existing?.name ?? ''}` : 'Create a new product'} breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Products', to: '/products' }, { label: isEdit ? 'Edit' : 'New' }]} />
      <Paper withBorder p="lg" radius="md" maw={600}>
        <form onSubmit={handleSubmit}>
          <Stack>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput label="Product Name" required {...form.getInputProps('name')} />
              <TextInput label="SKU" required {...form.getInputProps('sku')} />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <NumberInput label="Unit Price ($)" required min={0} decimalScale={2} {...form.getInputProps('unitPrice')} />
              <TextInput label="Category" {...form.getInputProps('category')} />
            </SimpleGrid>
            <Textarea label="Description" rows={3} {...form.getInputProps('description')} />
            <Switch label="Active" checked={form.values.isActive} onChange={(e) => form.setFieldValue('isActive', e.currentTarget.checked)} />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => navigate('/products')}>Cancel</Button>
              <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>{isEdit ? 'Update Product' : 'Create Product'}</Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </>
  );
}
