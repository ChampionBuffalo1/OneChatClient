import { z } from 'zod';
import { AxiosError } from 'axios';
import { ApiError } from '@/typings';
import { Button } from './ui/button';
import { ToastAction } from './ui/toast';
import { axiosInstance } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { useCallback, useMemo } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { AllPermissions, Permissions, checkPermission, setPermission } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const FormSchema = z.object({
  items: z.array(z.string()).refine(value => value.some(Boolean), {
    message: 'You have to select at least one item.'
  })
});

export default function PermissionForm({
  id,
  authorId,
  permission,
  authorPermission
}: {
  id: string;
  authorId: string;
  permission: number;
  authorPermission: number;
}) {
  const mutation = useMutation({
    mutationFn: async (permissions: number) => {
      const { data } = await axiosInstance.patch(
        `/group/${id}/member/permission`,
        JSON.stringify({
          permissions,
          userId: authorId
        })
      );
      return data;
    },
    onError: (error: AxiosError<ApiError>, variables) => {
      if (error.message === 'Network Error') {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
          action: (
            <ToastAction
              altText="Try again"
              onClick={() => mutation.mutateAsync(variables)}
              className="rounded-lg hover:bg-red-400 border border-gray-200 p-2"
            >
              Try again
            </ToastAction>
          )
        });
        return;
      }
      const err = error.response?.data.errors[0];
      if (err?.code === 'INSUFFICIENT_PERMISSION') {
        toast({
          title: 'Insufficient permission!',
          description: err.message
        });
      } else if (err?.code === 'INVALID_REQUEST') {
        toast({
          title: 'Invalid Request',
          description: 'Group not found!'
        });
      }
    }
  });

  const items = useMemo(() => {
    const values = Object.entries(Permissions).map(([label, id]) => ({
      id: id.toString(),
      label: label
        .split('_')
        .map(words => words.charAt(0).toUpperCase() + words.slice(1).toLowerCase())
        .join(' ')
    }));
    const keys = Object.keys(Permissions) as AllPermissions[];
    for (let i = keys.length - 1; i >= 0; i--) {
      if (!checkPermission(permission, keys[i])) {
        values.pop();
      }
    }
    return values;
  }, [permission]);

  const defaultValues = useMemo(() => {
    const allowed = [];
    for (const [key, bit] of Object.entries(Permissions)) {
      if (checkPermission(authorPermission, key as AllPermissions)) {
        allowed.push(bit.toString());
      }
    }
    return allowed;
  }, [authorPermission]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { items: defaultValues }
  });
  const onSubmit = useCallback(
    (data: z.infer<typeof FormSchema>) => {
      const permissions: AllPermissions[] = [];
      for (const item of data.items) {
        for (const [key, value] of Object.entries(Permissions)) {
          if (Number.parseInt(item, 10) === value) {
            permissions.push(key as AllPermissions);
          }
        }
      }
      mutation.mutateAsync(setPermission(0, permissions));
    },
    [mutation]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Permissions</FormLabel>
              </div>
              {items.map(item => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={checked =>
                              checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(field.value?.filter(value => value !== item.id))
                            }
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">{item.label}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button onClick={form.handleSubmit(onSubmit)}>Save Changes</Button>
      </form>
    </Form>
  );
}
