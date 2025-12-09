import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { UserCog, RefreshCw, Upload, Download, Play, AlertTriangle } from 'lucide-react';

export function SupportTools() {
  const [selectedTenant, setSelectedTenant] = useState('');
  const [impersonateReason, setImpersonateReason] = useState('');
  const [isImpersonating, setIsImpersonating] = useState(false);

  const handleImpersonate = () => {
    if (!selectedTenant || !impersonateReason) {
      toast({
        title: 'Missing information',
        description: 'Please select a tenant and provide a reason.',
        variant: 'destructive',
      });
      return;
    }
    setIsImpersonating(true);
    toast({
      title: 'Impersonation started',
      description: `Now viewing as ${selectedTenant} (read-only mode)`,
    });
  };

  const handleEndImpersonation = () => {
    setIsImpersonating(false);
    setSelectedTenant('');
    setImpersonateReason('');
    toast({
      title: 'Impersonation ended',
      description: 'You have returned to admin view.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Support Tools</h1>
        <p className="text-muted-foreground">Administrative tools for support and operations</p>
      </div>

      {/* Impersonation Banner */}
      {isImpersonating && (
        <div className="flex items-center justify-between bg-accent p-4 border border-accent">
          <div className="flex items-center gap-3">
            <UserCog className="h-5 w-5" />
            <div>
              <p className="font-medium">Impersonating: {selectedTenant}</p>
              <p className="text-sm">Read-only mode active</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleEndImpersonation}>
            End Impersonation
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tenant Impersonation */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Tenant Impersonation</CardTitle>
            </div>
            <CardDescription>
              View a tenant's dashboard as their admin (read-only)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Tenant</Label>
              <Select value={selectedTenant} onValueChange={setSelectedTenant}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a tenant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Acme Corp">Acme Corp</SelectItem>
                  <SelectItem value="TechStart Inc">TechStart Inc</SelectItem>
                  <SelectItem value="Global Retail">Global Retail</SelectItem>
                  <SelectItem value="LocalBiz Store">LocalBiz Store</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reason (Required for audit)</Label>
              <Textarea
                placeholder="Enter reason for impersonation (e.g., Support ticket #1234)"
                value={impersonateReason}
                onChange={(e) => setImpersonateReason(e.target.value)}
              />
            </div>
            <Button
              onClick={handleImpersonate}
              disabled={!selectedTenant || !impersonateReason || isImpersonating}
              className="w-full"
            >
              <UserCog className="mr-2 h-4 w-4" />
              Start Impersonation
            </Button>
          </CardContent>
        </Card>

        {/* Requeue Jobs */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Requeue Jobs</CardTitle>
            </div>
            <CardDescription>
              Retry failed jobs or requeue stuck messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Job Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="webhooks">Failed Webhooks</SelectItem>
                  <SelectItem value="messages">Failed Messages</SelectItem>
                  <SelectItem value="invoices">Pending Invoice Sync</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tenant (Optional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All tenants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tenants</SelectItem>
                  <SelectItem value="t1">Acme Corp</SelectItem>
                  <SelectItem value="t2">TechStart Inc</SelectItem>
                  <SelectItem value="t3">Global Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => toast({ title: 'Previewing affected jobs...' })}>
                Preview
              </Button>
              <Button onClick={() => toast({ title: 'Jobs queued for retry' })}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Requeue
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CSV Import */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">CSV Import Helper</CardTitle>
            </div>
            <CardDescription>
              Bulk import data for tenants
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Import Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select import type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Tenant</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="t1">Acme Corp</SelectItem>
                  <SelectItem value="t2">TechStart Inc</SelectItem>
                  <SelectItem value="t3">Global Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="border-2 border-dashed border-border p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Drag and drop CSV file or click to browse
              </p>
              <Input type="file" accept=".csv" className="hidden" id="csv-upload" />
              <Label htmlFor="csv-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <span>Choose File</span>
                </Button>
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Run Manual Jobs */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Run Manual Jobs</CardTitle>
            </div>
            <CardDescription>
              Trigger specific background jobs manually
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Razorpay Payments
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sync Razorpay Payments</DialogTitle>
                    <DialogDescription>
                      This will sync all pending Razorpay payments for the selected tenant.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Tenant</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tenant" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="t1">Acme Corp</SelectItem>
                          <SelectItem value="t2">TechStart Inc</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={() => toast({ title: 'Razorpay sync started' })}>
                      Run Sync
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Generate Monthly Report
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate Monthly Report</DialogTitle>
                    <DialogDescription>
                      Generate a comprehensive report for the selected month.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Month</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024-12">December 2024</SelectItem>
                          <SelectItem value="2024-11">November 2024</SelectItem>
                          <SelectItem value="2024-10">October 2024</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={() => toast({ title: 'Report generation started' })}>
                      Generate
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Clear Message Queue
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Message Queue</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All queued messages will be permanently deleted.
                      Are you sure you want to proceed?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => toast({ title: 'Message queue cleared', variant: 'destructive' })}
                    >
                      Clear Queue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SupportTools;
